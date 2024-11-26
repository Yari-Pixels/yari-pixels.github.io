class ThumbData:
    def __init__(self, src:str, mode:str = "cover", background:str = "#09004266", position:str = r"50% 50%"):
        self.src:str = src
        self.mode:str = mode
        self.background:str = background
        self.position = position

class ImageData:
    def __init__(self, src:str, thumb:ThumbData, alt:str = "image", hover:str = "image"):
        self.src:str = src
        self.alt:str = alt
        self.hover:str = hover
        self.thumb:ThumbData = thumb

    def as_dict(self):
        return {key: (vars(value) if hasattr(value, '__dict__') else value) for key, value in vars(self).items()}