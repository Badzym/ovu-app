# Ovu - Camera Overlay Drawing App

A mobile-friendly Angular application that enables camera access with overlay image functionality and drawing capabilities. Perfect for artists and designers who want to trace or draw over reference images using their phone's camera.

## Features

### 📸 Camera Functionality
- Access to device camera (back camera preferred on mobile)
- Real-time camera feed with high-quality video
- Camera start/stop controls

### 🖼️ Overlay Management
- Add transparent overlay images from your device
- Adjust opacity, scale, and rotation of overlays
- Position overlays precisely over the camera view
- Multiple overlay support with individual controls
- Easy overlay selection and removal

### ✏️ Drawing Tools
- Touch and mouse drawing support
- Real-time drawing over camera feed
- Clear drawing functionality
- Drawing mode toggle

### 📱 Mobile Optimized
- Responsive design for mobile devices
- Touch-friendly controls
- Full-screen camera view
- Optimized for phone usage

## How It Works

1. **Start Camera**: Tap "Start Camera" to access your device's camera
2. **Add Overlay**: Click "Add Overlay Image" to select an image from your device
3. **Position Overlay**: Use the controls to adjust opacity, scale, rotation, and position
4. **Enable Drawing**: Toggle drawing mode to draw over the camera view
5. **Trace Away**: Hold your phone over your reference image and start drawing!

## Perfect For
- Artists tracing reference images
- Designers working with overlays
- Anyone needing to draw over real-world objects
- Educational purposes for drawing tutorials

## Technology Stack

- **Framework**: Angular 17 with TypeScript
- **Styling**: SCSS with modern CSS features
- **Camera API**: WebRTC getUserMedia
- **Drawing**: HTML5 Canvas API
- **Mobile**: Responsive design with touch support

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ovu-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200`

### Building for Production

```bash
ng build
```

### Running on Mobile

For the best experience on mobile devices:

1. **Enable HTTPS** (required for camera access)
2. **Use a mobile browser** (Chrome, Safari, Firefox)
3. **Grant camera permissions** when prompted

## Development

### Project Structure
```
src/
├── app/
│   ├── components/
│   │   └── camera-overlay/          # Main camera component
│   ├── services/
│   │   └── camera.ts                # Camera and overlay logic
│   ├── app.component.ts             # Main app component
│   └── app.component.html           # Main app template
```

### Key Components

- **CameraOverlayComponent**: Main UI component handling camera view and controls
- **CameraService**: Service managing camera access, overlay images, and drawing functionality

### Adding Features

The app is built with Angular's standalone components, making it easy to extend:

1. Create new components: `ng generate component components/your-component`
2. Create new services: `ng generate service services/your-service`
3. Add to main app: Import and include in app.component.ts

## Browser Compatibility

- **Chrome**: Full support
- **Safari**: Full support (iOS 11+)
- **Firefox**: Full support
- **Edge**: Full support

## Security Notes

- Camera access requires HTTPS in production
- User must grant camera permissions
- Images are processed locally (no server upload)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check browser console for errors
- Ensure camera permissions are granted
- Test on different devices and browsers

---

**Note**: This app requires camera permissions and works best on mobile devices with HTTPS enabled.
