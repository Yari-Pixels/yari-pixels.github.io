import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import editJson
from classes import *

# It's a mess but it works (:

class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Image UI")
        self.geometry("400x400")

        self.image_frame = tk.Frame(self)
        self.thumbnail_frame = tk.Frame(self)
        self.button_frame = tk.Frame(self)

        self.image_frame.pack(padx=10, pady=10, fill=tk.X)
        self.thumbnail_frame.pack(padx=10, pady=10, fill=tk.X)
        self.button_frame.pack(padx=10, pady=10)

        self.createImageSection()
        self.createThumbnailSection()
        self.createButtons()

    def createImageSection(self):
        tk.Label(self.image_frame, text="Image").grid(row=0, column=0, columnspan=2)

        # Set a fixed width for the label column
        label_width = 10  # Adjust this value as needed

        tk.Label(self.image_frame, text="Src:", width=label_width, anchor='e').grid(row=1, column=0, sticky='ew')
        self.image_src = tk.Entry(self.image_frame)
        self.image_src.grid(row=1, column=1, sticky='ew')

        tk.Label(self.image_frame, text="Alt:", width=label_width, anchor='e').grid(row=2, column=0, sticky='ew')
        self.image_alt = tk.Entry(self.image_frame)
        self.image_alt.grid(row=2, column=1, sticky='ew')

        tk.Label(self.image_frame, text="Hover:", width=label_width, anchor='e').grid(row=3, column=0, sticky='ew')
        self.image_hover = tk.Entry(self.image_frame)
        self.image_hover.grid(row=3, column=1, sticky='ew')

        # Configure the column weights to allow expansion
        self.image_frame.grid_columnconfigure(1, weight=1)

    def createThumbnailSection(self):
        tk.Label(self.thumbnail_frame, text="Thumbnail").grid(row=0, column=0, columnspan=2)

        # Set a fixed width for the label column
        label_width = 10  # Adjust this value as needed

        tk.Label(self.thumbnail_frame, text="Src:", width=label_width, anchor='e').grid(row=1, column=0, sticky='ew')
        self.thumbnail_src = tk.Entry(self.thumbnail_frame)
        self.thumbnail_src.grid(row=1, column=1, sticky='ew')

        tk.Label(self.thumbnail_frame, text="Mode:", width=label_width, anchor='e').grid(row=2, column=0, sticky='ew')
        self.thumbnail_mode = tk.StringVar(value="cover")    # default value
        thumbnail_mode_options = ["", "cover", "contain", "none"]
        self.thumbnail_mode_menu = ttk.OptionMenu(self.thumbnail_frame, self.thumbnail_mode, *thumbnail_mode_options)
        self.thumbnail_mode_menu.grid(row=2, column=1, sticky='ew')

        tk.Label(self.thumbnail_frame, text="Background:", width=label_width, anchor='e').grid(row=3, column=0, sticky='ew')
        self.thumbnail_background = tk.Entry(self.thumbnail_frame)
        self.thumbnail_background.grid(row=3, column=1, sticky='ew')

        tk.Label(self.thumbnail_frame, text="Position:", width=label_width, anchor='e').grid(row=4, column=0, sticky='ew')
        self.thumbnail_position = tk.Entry(self.thumbnail_frame)
        self.thumbnail_position.grid(row=4, column=1, sticky='ew')

        # Configure the column weights to allow expansion
        self.thumbnail_frame.grid_columnconfigure(1, weight=1)

    def createButtons(self):
        tk.Button(self.button_frame, text="Open Image", command=self.fileOpenDialog).pack(side=tk.LEFT, padx=10)
        tk.Button(self.button_frame, text="Save", command=self.saveToJson).pack(side=tk.LEFT, padx=10)
    
    def showWarning(self, text:str):
        messagebox.showwarning("warning", text)

    def showMessage(self, text:str):
        messagebox.showinfo("info", text)

    def setEntryValue(self, entry:tk.Entry, value:str):
        entry.delete(0, tk.END)
        entry.insert(0, value)

    def setUp(self, image:ImageData):
        self.setEntryValue(self.image_src, image.src)
        self.setEntryValue(self.image_alt, image.alt)
        self.setEntryValue(self.image_hover, image.hover)
        self.setEntryValue(self.thumbnail_src, image.thumb.src)
        self.setEntryValue(self.thumbnail_background, image.thumb.background)
        self.setEntryValue(self.thumbnail_position, image.thumb.position)
        self.thumbnail_mode.set(image.thumb.mode)  

    def fileOpenDialog(self):
        self.withdraw()
        self.filePath:str = filedialog.askopenfilename()
        try:
            image:ImageData = editJson.setUp(self.filePath)
        except Exception as e:
            self.showWarning(e)
        else:
            self.setUp(image)
        self.deiconify()

    def saveToJson(self):
        thumb:ThumbData = ThumbData (
            self.thumbnail_src.get(),
            self.thumbnail_mode.get(),
            self.thumbnail_background.get(),
            self.thumbnail_position.get()
        )
        image:ImageData = ImageData (
            self.image_src.get(),
            thumb,
            self.image_alt.get(),
            self.image_hover.get()
        )
        try:
            editJson.saveChanges(image, self.filePath)
        except Exception as e:
            self.showWarning(e)
        else:
            self.showMessage("data saved successfully")

if __name__ == "__main__":
    app = Application()
    app.mainloop()