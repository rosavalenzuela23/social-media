import torch
from torch import nn
import torch.nn.functional as F

class NeuralNetwork(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        #3 rgb channels (input feature maps)
        #8 outputs (feature maps)
        #3x3 kernel radious
        #1 stride (default)
        #0 padding (default)
        #output = floor of (input - kernel + (2 x padding) radious / stride)+1
        #output result = (256 - 3 / 1)+1 = 254
        self.conv1 = nn.Conv2d(3,8, 3) # output shape = 8 feature maps, 254x254 resolution

        #kernel radious = 2x2
        #output resolution = floor of resolution/kerner radious
        self.maxpool1 = nn.MaxPool2d(2,2) # output shape = 8 feature maps, 127x127 resolution

        #8 feature maps
        #16 outputs
        #3x3 kernel radious
        #1 stride (default)
        #output result = (127 - 3 / 1)+1 = 125
        self.conv2 = nn.Conv2d(8,16, 3) # output shape = 16, 125x125
        
        #kernel radious = 2x2
        self.maxpool2 = nn.MaxPool2d(2,2) # output shape = 16 feature maps, 62x62 resolution

        #16 feature maps
        #32 outputs
        #3x3 kernel radious
        #1 stride (default)
        #output result = (62 - 3 / 1)+1 = 60
        self.conv3 = nn.Conv2d(16,32, 3) # output shape = 16, 60x60
        
        #kernel radious = 2x2
        self.maxpool3 = nn.MaxPool2d(2,2) # output shape = 32 feature maps, 30x30 resolution

        #32 feature maps
        #64 outputs
        #3x3 kernel radious
        #1 stride (default)
        #output result = (30 - 3 / 1)+1 = 28
        self.conv4 = nn.Conv2d(32,64, 3) # output shape = 64, 28x28
        
        #kernel radious = 2x2
        self.maxpool4 = nn.MaxPool2d(2,2) # output shape = 64 feature maps, 14x14 resolution

        #64 feature maps
        #128 outputs
        #3x3 kernel radious
        #1 stride (default)
        #output result = (14 - 3 / 1)+1 = 12
        self.conv5 = nn.Conv2d(64,128, 3) # output shape = 128, 6x6
        
        #kernel radious = 2x2
        self.maxpool5 = nn.MaxPool2d(2,2) # output shape = 64 feature maps, 14x14 resolution


        # Dense layers
        # 128 feature maps
        # 6 Height
        # 6 Width
        # size = 128 x 6 x 6 = 4608 parameters

        #output features = (sqrt(size x final expected output)) = (sqrt(4608x10)) = 241.6 -> Round to powers of 2 -> 256
        #MAX 1024
        self.fc1 = nn.Linear(in_features=128 * 6 * 6, out_features=256)
        
        #10 classifications
        self.fc2 = nn.Linear(in_features=256, out_features=num_classes)

    def forward(self, x):
            
            x = self.conv1(x)
            x = F.relu(x)
            x = self.maxpool1(x)
            
            x = self.conv2(x)
            x = F.relu(x)
            x = self.maxpool2(x)

            x = self.conv3(x)
            x = F.relu(x)
            x = self.maxpool3(x)

            x = self.conv4(x)
            x = F.relu(x)
            x = self.maxpool4(x)

            x = self.conv5(x)
            x = F.relu(x)
            x = self.maxpool5(x)
            
            # Flatten the 3D tensor into a 1D vector for the Linear layers
            # '1' tells PyTorch to keep the batch dimension separate and flatten everything else
            x = torch.flatten(x, 1) 
            
            x = self.fc1(x)
            x = F.relu(x)
            
            x = F.dropout(x, p=0.5, training=self.training)

            # Output layer (raw logits, no activation if using CrossEntropyLoss later)
            x = self.fc2(x) 
            
            return x
