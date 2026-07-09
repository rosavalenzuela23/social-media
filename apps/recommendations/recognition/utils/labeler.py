import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def _discover_classes(root_path: str):
    """
    Discover class folders dynamically and assign numeric labels.
    Returns:
        class_names: list[str]
        label_to_idx: dict[str, int]
        idx_to_label: dict[int, str]
    """
    if not root_path or not os.path.isdir(root_path):
        raise ValueError(f"Invalid dataset path: {root_path}")

    class_names = sorted(
        folder_name
        for folder_name in os.listdir(root_path)
        if os.path.isdir(os.path.join(root_path, folder_name))
    )

    if not class_names:
        raise ValueError(f"No class folders found in dataset path: {root_path}")

    label_to_idx = {class_name: idx for idx, class_name in enumerate(class_names)}
    idx_to_label = {idx: class_name for class_name, idx in label_to_idx.items()}

    return class_names, label_to_idx, idx_to_label


def _build_dataset(root_path: str):
    """
    Build a dataframe from a folder-based dataset.
    Each subfolder name becomes a class label.
    """
    class_names, label_to_idx, idx_to_label = _discover_classes(root_path)

    data = []

    for class_name in class_names:
        class_folder = os.path.join(root_path, class_name)

        for image_file in os.listdir(class_folder):
            if not image_file.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            image_path = os.path.join(class_folder, image_file)

            data.append({
                "image_path": image_path,
                "label": label_to_idx[class_name],
                "label_name": class_name
            })

    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError(f"No images found in dataset path: {root_path}")

    return df.reset_index(drop=True), label_to_idx, idx_to_label


def get_training_dataset():
    return _build_dataset(os.getenv("TRAINING_DATASET_PATH"))


def get_evaluation_dataset():
    return _build_dataset(os.getenv("EVALUATION_DATASET_PATH"))