# Mood Board Application (v0.0.0)

A digital mood board application that allows users to create, customize, and manage visual collections. This interactive
tool lets you arrange images on a canvas, adjust background colors, and save your creative inspirations.

![Mood Board Screenshot](images/screenshot.png)

## 🌟 Features

- **Image Management**
    - Add images to your mood board via file upload
    - Drag and position images anywhere on the canvas
    - Remove individual images
    - Clear all images with confirmation dialog

- **Interactive Canvas**
    - Customizable background color with color picker
    - Predefined color palette for quick selection
    - Special background effects including rainbow gradient
    - Zoom in/out functionality with visual indicator

- **Responsive Controls**
    - Intuitive UI with animated feedback
    - Z-index management (bring images to front)
    - Persistent state (auto-saves to localStorage)
    - Empty state handling with clear visuals

- **Keyboard Shortcuts**
    - `Ctrl+N` (or `Cmd+N` on Mac) to quickly add new images
    - `Ctrl/Cmd` + Mouse Wheel to zoom in/out of the canvas

## 🚀 Technologies Used

- **Core Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: React Context API
- **Styling**:
    - Tailwind CSS with plugins (@tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio)
    - CSS modules for component-specific styling
- **UI Components**: Shadcn UI library
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Date Management**: date-fns
- **Notifications**: Sonner Toast
- **Icons**: Lucide React
- **Testing**: Jest with React Testing Library

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

## 🛠️ Development

Run the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

This will start a development server at `http://localhost:5173` (or another port if 5173 is busy).

## 📋 Available Scripts

- `dev`: Runs the development server with Vite
- `build`: Runs TypeScript type checking and builds for production
- `build:production`: Builds the application for production without type checking
- `test`: Runs TypeScript type checking and executes Jest tests
- `check-unused-exports`: Utility to find unused exports in the codebase

## 🏗️ Project Structure

```
src/
├── components/         # UI components
│   ├── MoodBoard/      # Main Mood Board components
│   ├── AddImageModal/  # Modal for adding images
│   └── ...            
├── contexts/           # React Context providers
│   ├── ImageContext.tsx    # Manages images state
│   ├── ThemeContext.tsx    # Manages background color
│   └── ZoomContext.tsx     # Manages zoom functionality
├── layouts/            # Page layout components
├── shadcn/             # Shadcn UI components
├── styles/             # Global styles
├── themes/             # Theme definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🔨 Building for Production

Build the application for production:

```bash
# Full build with type checking
npm run build
# or
yarn build

# Production build without type checking
npm run build:production
# or
yarn build:production
```

The built files will be in the `dist` directory, ready for deployment.

## 🧪 Testing

Run the test suite:

```bash
npm run test
# or
yarn test
```

This project uses Jest and React Testing Library for testing components and functionality.

## 🔍 Debugging

### Common Issues and Solutions

1. **Images not loading**
    - Check browser console for error messages
    - Verify image URLs are accessible
    - Try clearing localStorage: `localStorage.clear()`

2. **Drag and drop not working**
    - Ensure you're clicking on the movable part of the image card
    - Check if any CSS is interfering with pointer events

3. **Changes not persisting**
    - Verify localStorage is enabled in your browser
    - Check for console errors related to storage quota

### Development Tips

- Use browser developer tools to inspect React components
- Enable localStorage debugging in Chrome DevTools (Application tab)
- Check for React errors in the console with React DevTools extension

## 🌐 Browser Compatibility

This application is compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For the best experience, use a modern browser with localStorage and modern CSS support.

## 🔧 Customization

The mood board can be customized through:

1. Background color changes via the color picker
2. Canvas zoom level (0.5x to 3x)
3. Image positioning and arrangement

## 📝 License

[MIT License](LICENSE)

---

*This README was last updated on April 4, 2025.*