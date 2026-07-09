from ...utils.labeler import get_training_dataset
import torch
from torch import nn
from .neural_network import NeuralNetwork
from torch.utils.data import DataLoader
from ...utils.image_data import ImageDataset, scale_image
from pathlib import Path


MODEL_PATH = Path("cnn.pth")


def get_device():
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

def prepare_data():
    df, label_to_idx, idx_to_label = get_training_dataset()
    df = df.dropna(subset=['image_path'])
    df['image'] = df['image_path'].apply(lambda path: scale_image(path, 256))
    df = df.dropna(subset=['image'])
    return df.reset_index(drop=True), len(label_to_idx)

def train(model, dataloader, loss_fn, optimizer, device, epochs = 10):
    model.train()
    for epoch in range(epochs):
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            
            # 1. Forward pass (compute predictions)
            predictions = model(images)
            
            # 2. Compute loss
            loss = loss_fn(predictions, labels)
            
            # 3. Backpropagation (the actual learning part)
            optimizer.zero_grad() # Clear old gradients
            loss.backward()       # Compute new gradients
            optimizer.step()      # Update weights
            
        print(f"Epoch {epoch+1} complete. Loss: {loss.item():.4f}")


def main():

    df, num_classes = prepare_data()
    dataset = ImageDataset(df)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    device = get_device()
    print(f"Using {device} device")
    model = NeuralNetwork(num_classes=num_classes).to(device)
    loss_fn = nn.CrossEntropyLoss() 
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001) 
    train(model, dataloader, loss_fn, optimizer, device, epochs=10)
    torch.save(model.state_dict(), MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
        

if __name__ == "__main__":
    main()
