# 🌟 JoyPulse - Mood of the Nation Dashboard

A beautiful, interactive "Mood of the Nation" dashboard that captures the emotional pulse of cities across India. Built with glassmorphism aesthetics, premium spring physics, and delightful interactions.

## ✨ Features

### 🎨 Visual Design
- **Glassmorphism Aesthetic**: Frosted glass effects with soft blurs and transparency
- **Dark Mode**: Sophisticated dark background with vibrant gradients
- **Dynamic Gradients**: Background shifts from Deep Blue (sad) to Radiant Gold (happy)
- **Premium Typography**: Plus Jakarta Sans font family for modern, clean look

### 🎯 Core Features

#### 1. Hero Section
- **Dynamic City Detection**: Auto-detects user's city via IP geolocation
- **Premium Vertical Slider**: Heavy, satisfying slider with spring physics
- **Live Emoji Feedback**: Emoji changes based on mood (😢 → 😔 → 😊 → 😄 → 🤩)
- **Gradient Morphing**: Entire page background transitions with mood
- **Pulsing CTA**: "Log Mood" button with shimmer and pulse animations

#### 2. Live Map Visualization
- **Stylized India Map**: SVG-based map with interactive cities
- **Heat Map Bubbles**: Color-coded mood indicators for major cities
  - 🟡 Gold/Green: Happy cities
  - 🔵 Blue/Purple: Sad cities
- **Live Ticker**: Real-time mood updates from across the nation
- **Interactive Bubbles**: Hover and click for city details

#### 3. Joy Spark Cards
- **Action Suggestions**: Three cards with mood-boosting activities
  - ☕ Buy a stranger coffee
  - 📞 Call a parent
  - 💬 Post a compliment
- **Glass Effect**: Beautiful glassmorphic card design
- **Hover Glows**: Radial gradient effects on hover
- **Confetti Rewards**: Mini confetti burst on card click

#### 4. Social Proof Footer
- Simple, clean footer with branding
- Navigation links: About, Manifest, Privacy
- Made with ❤️ message

### 🔧 Technical Features

#### Spring Physics
- Custom spring physics implementation
- Configurable tension, friction, and mass
- Smooth, natural motion with momentum
- 60fps animation loop

#### Confetti System
- Emoji confetti explosions matching mood
- Multi-burst effects from multiple origins
- Color-coordinated particles
- 3-second celebratory animation

#### Interactions
- Premium slider with grab/grabbing cursor
- Keyboard controls (Arrow Up/Down)
- Smooth hover effects on all interactive elements
- Responsive design for mobile, tablet, and desktop

## 🚀 Getting Started

### Quick Start
Simply open `index.html` in a modern web browser. No build process required!

```bash
# Clone the repository
git clone <repository-url>

# Navigate to directory
cd First-test-

# Open in browser
open index.html
# or
python -m http.server 8000  # Then visit http://localhost:8000
```

### File Structure
```
First-test-/
├── index.html      # Main HTML structure
├── styles.css      # Glassmorphism styles and animations
├── script.js       # Interactive features and spring physics
└── README.md       # This file
```

## 🎮 Usage

### Logging Your Mood
1. Move the vertical slider to match your current mood
2. Watch the background gradient shift in real-time
3. See the emoji change to reflect your feeling
4. Click "Log Mood" to trigger a confetti celebration

### Exploring the Map
- Hover over city bubbles to see their mood scores
- Click bubbles to add updates to the live ticker
- Watch the ticker for real-time mood changes

### Joy Sparks
- Click any Joy Spark card for inspiration
- Get a mini confetti reward for each interaction
- Use these suggestions to boost your city's happiness score

### Keyboard Shortcuts
- `Arrow Up`: Increase mood by 5%
- `Arrow Down`: Decrease mood by 5%

## 🎨 Design System

### Color Palette
```css
--color-gloomy:   #1e3a8a  /* Deep Blue - Very Sad */
--color-sad:      #3b82f6  /* Blue - Sad */
--color-neutral:  #8b5cf6  /* Purple - Neutral */
--color-happy:    #f59e0b  /* Orange - Happy */
--color-ecstatic: #fbbf24  /* Gold - Ecstatic */
```

### Mood States
- **0-20%**: 😢 Feeling Down (Deep Blue)
- **20-40%**: 😔 A Bit Low (Blue)
- **40-60%**: 😊 Feeling Good (Purple)
- **60-80%**: 😄 Pretty Happy (Orange)
- **80-100%**: 🤩 Absolutely Ecstatic (Gold)

### Glassmorphism Effects
```css
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.18)
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37)
```

## 🛠️ Technologies

- **HTML5**: Semantic structure
- **CSS3**: Custom properties, animations, backdrop-filter
- **Vanilla JavaScript**: ES6+, Custom spring physics
- **Canvas Confetti**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) library
- **IPApi**: City detection via [ipapi.co](https://ipapi.co/)

## 📱 Browser Support

- Chrome/Edge 79+ ✅
- Firefox 103+ ✅
- Safari 15.4+ ✅
- Opera 66+ ✅

**Note**: Requires `backdrop-filter` support for full glassmorphism effects.

## 🎯 Future Enhancements

- [ ] Backend integration for real mood data
- [ ] User authentication and mood history
- [ ] More detailed city statistics
- [ ] Social sharing features
- [ ] Mood trends and analytics
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] More interactive map regions
- [ ] Mood-based music recommendations
- [ ] Community challenges and goals

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 💖 Acknowledgments

- Design inspired by modern glassmorphism trends
- Spring physics based on react-spring concepts
- Confetti library by [catdad](https://github.com/catdad)
- Font: Plus Jakarta Sans by Google Fonts

---

**Made with ❤️ for a happier nation.**

*JoyPulse - Because every mood matters.* 🌟
