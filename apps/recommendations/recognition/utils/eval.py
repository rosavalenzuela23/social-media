import os
from pathlib import Path
import sys
from io import BytesIO

import torch
from dotenv import load_dotenv
from torch import nn
from torch.utils.data import DataLoader
from torchvision import models, transforms
from torchvision.models import ResNet18_Weights

from ..scratch_cnn.training.neural_network import NeuralNetwork
from .image_data import ImageDataset as CnnImageDataset
from .image_data import scale_image
from .labeler import get_evaluation_dataset, get_training_dataset
from .resnet_image import ImageDataset as ResNetImageDataset

from PIL import Image


load_dotenv()

CNN_MODEL_PATH = "cnn.pth"
RESNET_MODEL_PATH = "resnet18_feature_classifier_bbox.pth"
IMG_SIZE = 224

RESNET_EVAL_TRANSFORM = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


class ResNetFeatureClassifier(nn.Module):
    def __init__(self, num_classes=10, freeze_backbone=True):
        super().__init__()

        weights = ResNet18_Weights.DEFAULT
        resnet = models.resnet18(weights=weights)

        self.feature_extractor = nn.Sequential(*list(resnet.children())[:-1])

        if freeze_backbone:
            for param in self.feature_extractor.parameters():
                param.requires_grad = False

        self.classifier = nn.Linear(resnet.fc.in_features, num_classes)

    def forward(self, x):
        features = self.feature_extractor(x)
        features = torch.flatten(features, 1)
        logits = self.classifier(features)
        return logits


def prepare_evaluation_data():
    df, _, idx_to_label = get_evaluation_dataset()
    df["image"] = df["image_path"].apply(lambda path: scale_image(path, 256))
    df = df.dropna(subset=["image"]).reset_index(drop=True)
    return df, idx_to_label


def get_device():
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_or_train_model(model_type="cnn", path=None):
    _, label_to_idx, _ = get_training_dataset()
    num_classes = len(label_to_idx)
    device = get_device()
    path = path or (CNN_MODEL_PATH if model_type == "cnn" else RESNET_MODEL_PATH)

    if model_type == "resnet":
        model = ResNetFeatureClassifier(num_classes=num_classes, freeze_backbone=True)
    else:
        model = NeuralNetwork(num_classes=num_classes)

    model = model.to(device)

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model not found at {path}")

    model.load_state_dict(torch.load(path, map_location=device))
    model.eval()
    return model, device


def evaluate_model(model, device, model_type="cnn", batch_size=32):
    df, idx_to_label = prepare_evaluation_data()
    if model_type == "resnet":
        dataset = ResNetImageDataset(df, transform=RESNET_EVAL_TRANSFORM)
    else:
        dataset = CnnImageDataset(df)

    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)

    all_preds = []
    all_true = []

    with torch.no_grad():
        for images, labels in dataloader:
            images = images.to(device)
            labels = labels.to(device)

            logits = model(images)
            preds = torch.argmax(logits, dim=1)

            all_preds.extend(preds.cpu().tolist())
            all_true.extend(labels.cpu().tolist())

    results_df = df.copy()
    results_df["true_label_id"] = all_true
    results_df["pred_label_id"] = all_preds
    results_df["true_label_name"] = results_df["true_label_id"].map(idx_to_label)
    results_df["pred_label_name"] = results_df["pred_label_id"].map(idx_to_label)
    results_df["correct"] = results_df["true_label_id"] == results_df["pred_label_id"]

    pred_distribution = (
        results_df["pred_label_name"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

    true_distribution = (
        results_df["true_label_name"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

    accuracy = results_df["correct"].mean()

    return {
        "accuracy": accuracy,
        "pred_distribution": pred_distribution,
        "true_distribution": true_distribution,
        "results_df": results_df,
    }


def main():
    print("choose model:")
    print("0.- CNN")
    print("1.- Resnet18 Feature Extraction")
    answer = input("Model: ").strip()

    if answer == "1":
        model_type = "resnet"
        model_path = RESNET_MODEL_PATH
    else:
        model_type = "cnn"
        model_path = CNN_MODEL_PATH

    model, device = load_or_train_model(model_type=model_type, path=model_path)
    results = evaluate_model(model, device, model_type=model_type)

    print("\n=== Evaluation Results ===")
    print(f"Accuracy: {results['accuracy']:.4f}")

    print("\nPredicted class distribution:")
    for label, count in results["pred_distribution"].items():
        print(f"{label}: {count}")

    print("\nTrue class distribution:")
    for label, count in results["true_distribution"].items():
        print(f"{label}: {count}")

    print("\nSample predictions:")
    print(
        results["results_df"][
            ["true_label_name", "pred_label_name", "correct"]
        ].head(20)
    )

    return results

def single_test(path):
    model_type = "resnet"
    model_path = RESNET_MODEL_PATH
    image_path = Path(path).expanduser()

    if not image_path.is_file():
        raise FileNotFoundError(f"Image not found at {image_path}")

    _, _, idx_to_label = get_training_dataset()

    model, device = load_or_train_model(model_type=model_type, path=model_path)
    model.eval()

    original_image = Image.open(image_path).convert("RGB")
    png_buffer = BytesIO()
    original_image.save(png_buffer, format="PNG")
    png_buffer.seek(0)
    image = Image.open(png_buffer).convert("RGB")
    image = RESNET_EVAL_TRANSFORM(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        pred_idx = outputs.argmax(dim=1).item()
    if outputs[0][pred_idx] > 0:
        pred_label = idx_to_label[pred_idx]
    else:
        pred_label = "other"

    return {
        "image_path": str(image_path),
        "predicted_label_id": pred_idx,
        "predicted_label_name": pred_label,
    }


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(single_test(sys.argv[1]))
    else:
        main()
