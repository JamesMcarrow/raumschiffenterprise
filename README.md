# Sirv 3D Viewer - Local GLB Example

Minimal example of using Sirv Media Viewer with a local GLB file.

## File Structure
```
_atrn_BERLIN/
├── web/
│   ├── index.html      (this example)
│   ├── server.py       (local server script)
│   └── README.md
└── nabytek/
    └── zidle_01.glb    (your 3D model)
```

## Usage

### Option 1: Using Python HTTP Server (Recommended)

1. Make sure you have Python installed
2. Run the server:
   ```bash
   python server.py
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000/web/index.html
   ```

### Option 2: Using Node.js http-server

1. Install http-server globally (if not already installed):
   ```bash
   npm install -g http-server
   ```
2. Navigate to the parent directory (`_atrn_BERLIN`):
   ```bash
   cd ..
   ```
3. Start the server:
   ```bash
   http-server -p 8000
   ```
4. Open: `http://localhost:8000/web/index.html`

### Option 3: Using VS Code Live Server

If you're using VS Code, you can use the Live Server extension:
1. Install the "Live Server" extension
2. Right-click on `index.html` and select "Open with Live Server"

## Notes

- The GLB file path in `index.html` is set to `../nabytek/zidle_01.glb`
- Sirv Media Viewer requires files to be served via HTTP (not `file://` protocol)
- The viewer supports various options - see the [Sirv documentation](https://sirv.com/help/articles/3d-model/) for customization

## Customization

You can add options to the 3D viewer by modifying the `data-options` attribute:

```html
<div data-src="../nabytek/zidle_01.glb" 
     data-options="autorotate.enable:true; autorotate.speed:15; zoom:true"></div>
```

Available options include:
- `autorotate.enable:true` - Enable auto-rotation
- `autorotate.speed:15` - Rotation speed (degrees per second)
- `zoom:true` - Enable zoom
- `animation.autoplay:true` - Auto-play animations if present
- And many more (see Sirv documentation)

