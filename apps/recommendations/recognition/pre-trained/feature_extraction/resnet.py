from ...utils.labeler import get_training_dataset
import torch
from torch import nn
from torchvision import models, transforms
from torchvision.models import ResNet18_Weights
from torch.utils.data import DataLoader
from ...utils.resnet_image import ImageDataset
from pathlib import Path


IMG_SIZE = 224
MODEL_PATH = Path("resnet18_feature_classifier_bbox.pth")

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.9, 1.0)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(8),
    transforms.ColorJitter(
        brightness=0.1,
        contrast=0.1,
        saturation=0.1,
        hue=0.03
    ),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

eval_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def prepare_data():
    df, label_to_idx, idx_to_label = get_training_dataset()
    num_classes = len(label_to_idx)
    return df.reset_index(drop=True), num_classes


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


def train(model, dataloader, loss_fn, optimizer, device, epochs=10):
    model.train()

    for epoch in range(epochs):
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)

            predictions = model(images)
            loss = loss_fn(predictions, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

            preds = predictions.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        avg_loss = running_loss / len(dataloader)
        acc = correct / total if total > 0 else 0.0
        print(f"Epoch {epoch + 1}/{epochs} - Loss: {avg_loss:.4f} - Acc: {acc:.4f}")


def main():
    df, num_classes = prepare_data()

    print("Class distribution:")
    print(df["label"].value_counts().sort_index())

    dataset = ImageDataset(df, transform=train_transform)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using {device} device")

    model = ResNetFeatureClassifier(num_classes=num_classes, freeze_backbone=True).to(device)

    loss_fn = nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=1e-3
    )

    train(model, dataloader, loss_fn, optimizer, device, epochs=10)

    torch.save(model.state_dict(), MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
