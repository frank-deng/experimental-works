from PIL import Image, ExifTags
from pathlib import Path

def get_date(img):
    exif_data=img._getexif()
    if exif_data is None:
        return None
    for tag_id,value in exif_data.items():
        tag_name=ExifTags.TAGS.get(tag_id,tag_id)
        if tag_name=='DateTimeOriginal':
            return value

path=Path('/sdcard/DCIM/Camera')
jpg_files=list(path.glob("*.jpg"))+list(path.glob("*.jpeg"))
for file in jpg_files:
    img=Image.open(file)
    print(file,get_date(img))
    img.close()
