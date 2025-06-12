# Solar System 3D Visualization

## How to Use

### Prerequisites
- Node.js installed on your system
- A modern web browser with WebGL support

### Installation & Setup

1. **Clone or download the project**
   ```bash
   git clone [text](https://github.com/PrajwalK44/threejssolar)
   cd solar-system-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the images folder**
   Create an `images` folder in your project root and add the following texture files:
   - `stars.jpg`
   - `earth.jpg`
   - `sun.jpg`
   - `jupiter.jpg`
   - `mars.jpg`
   - `mercury.jpg`
   - `venus.jpg`
   - `saturn.jpg`
   - `neptune.jpg`
   - `uranus.jpg`
   - `saturn ring.png`
   - `uranus ring.png`

4. **Run the development server**
   ```bash
   npx vite
   ```

5. **Open in browser**
   - The terminal will show a local URL (usually `http://localhost:5173`)
   - Open this URL in your web browser

### Controls & Features

**Camera Controls:**
- **Mouse drag**: Rotate around the solar system
- **Mouse wheel**: Zoom in/out
- **Orbit controls**: Smooth camera movement with damping

**Interactive Features:**
- **Hover over planets**: View detailed information tooltips
- **Speed controls**: Use the right panel to adjust individual planet rotation speeds
- **Pause/Resume**: Control animation playback
- **Theme toggle**: Switch between dark and light modes

**Planet Information:**
Each planet displays:
- Name and distance from the Sun
- Descriptive information about the planet
- Real-time hover tooltips

### Project Structure
```
project-root/
├── images/           # Planet and space textures
├── main.js          # Main application code
├── index.html       # HTML entry point
├── package.json     # Dependencies
└── vite.config.js   # Vite configuration (if needed)
```

### Troubleshooting
- If textures don't load, ensure all image files are in the `/images/` folder
- If the page is blank, check the browser console for JavaScript errors
- Make sure your browser supports WebGL for 3D rendering