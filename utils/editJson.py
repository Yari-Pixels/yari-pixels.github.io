import json
from classes import ImageData, ThumbData
from shutil import copyfile
import tkinter as tk
from tkinter import filedialog
import os

def processFilePath(filePath:str):
    if filePath:
        fileName = os.path.basename(filePath)

        return fileName
    else:
        raise ValueError("no file selected")

def initImage(imageName:str):
    thumb:ThumbData = ThumbData(imageName)
    return ImageData(imageName, thumb)

def setUp(filePath:str):
    imageName:str = processFilePath(filePath)
    image:ImageData = initImage(imageName)
    return image

def saveChanges (image:ImageData, filePath):
    source:str = filePath
    destination:str = "../img/" + image.src
    copyfile(source, destination)

    with open ("../js/images.json", "r") as file:
        importedPalettes:dict = json.load (file)
    with open ("../js/images.json.bak", "w") as file:
        json.dump(importedPalettes, file)

    keys:int = list (map (int, importedPalettes.keys()))
    nextKey:str = str (max (keys) + 1)
    importedPalettes[nextKey] = image.as_dict()

    with open ("../js/images.json", "w") as file:
        json.dump (importedPalettes, file)