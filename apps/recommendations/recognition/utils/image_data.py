from torch.utils.data import Dataset
import torch
import cv2
class ImageDataset(Dataset):
    def __init__(self, dataframe):
        self.dataframe = dataframe.reset_index(drop=True)

    def __len__(self):
        return len(self.dataframe)

    def __getitem__(self, idx):
        row = self.dataframe.iloc[idx]

        image = row["image"]
        label = int(row["label"])

        image = torch.tensor(image, dtype=torch.float32).permute(2, 0, 1)
        label = torch.tensor(label, dtype=torch.long)

        return image, label
    

def scale_image(image_url, target_size):
    image = cv2.imread(image_url)
    if image is None:
        return None
    
    #BGR to RGB (PyTorch standard)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (target_size, target_size))
    
    #Scale pixel values to 0-1 range
    return image.astype('float32') / 255.0