"""Contact sheet of QA stills: python3 tools/sheet.py <prefix>  -> previews/<prefix>_sheet.jpg"""
import glob
import sys
from PIL import Image

p = sys.argv[1]
fs = sorted(glob.glob(f"previews/{p}_[0-9]*.jpg"))
ims = [Image.open(f) for f in fs]
w, h = ims[0].size
cols = 6
rows = (len(ims) + cols - 1) // cols
s = Image.new("RGB", (w * cols // 2, h * rows // 2), "white")
for i, im in enumerate(ims):
    s.paste(im.resize((w // 2, h // 2)), ((i % cols) * w // 2, (i // cols) * h // 2))
s.save(f"previews/{p}_sheet.jpg", quality=85)
print(len(fs), "stills")
