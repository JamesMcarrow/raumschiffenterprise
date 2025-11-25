# Raumschiff Katalog – 3D Model Viewer

A simple, local-first 3D model catalog built with the Google Model Viewer. Shows a list of items and lets you view each 3D model on its own page.

## File Structure
```
web/
├── index.html          # Main catalog page
├── viewer.html          # Individual 3D model viewer page
├── index.css            # Styles for the catalog
├── viewer.css           # Styles for the viewer
├── data.js              # Catalog data (no remote JSON loading)
├── r_kat_icon.png       # Favicon
├── TopolRegular.ttf     # Custom font
├── server.py            # Local server script
└── README.md            # This file
models/
├── zidle_01/
│   ├── zidle_01.gltf
│   └── textures/
├── stul_01/
│   ├── stul_01.gltf
│   └── textures/
└── lampa_01/
    ├── lampa_01.gltf
    └── textures/
```

## Usage

### Python HTTP Server

1. Make sure you have Python installed.
2. Run the server:
   ```bash
   python server.py
   ```
3. Open your browser to:
   ```
   http://localhost:8000/index.html
   ```

## How It Works

- **index.html** shows a list of items (N01–N06, I01–I06, U01–U06).
- Clicking an item opens `viewer.html?item=XYZ`.
- `viewer.html` reads the catalog from `data.js` (no remote JSON fetching).
- If the item exists and has a model, it loads the 3D model.
- If the item isn’t found, it shows: “Tenhle objekt zatím neexistuje :(” in white Topol font.
- Both pages use `r_kat_icon.png` as the favicon.

## Customization

- **Add/remove items**: Edit `data.js`.
- **Update styles**: Edit `index.css` (catalog) or `viewer.css` (viewer).
- **Replace models**: Update paths in `data.js` and place `.gltf` files under `models/`.

## Notes

- Uses Google Model Viewer (`<model-viewer>`).
- No external fetching—everything is local.
- Font: Topol (custom TTF). Fallback to Arial.
- Viewer frame: orange, clipped corners.
- “Item not found” text: white, Topol, 24px.

