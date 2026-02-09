# Fullscreen Slider - Responsive Behavior Guide

## 📱 Responsive Breakpoint

The slider automatically switches between two modes based on screen width:

### Desktop Mode (≥992px)
✅ Fullscreen slider **ENABLED**
- Snap scrolling between slides
- Mouse wheel navigation
- Keyboard navigation
- Dot navigation visible
- Progress bar visible (if enabled)
- Each slide takes 100vh

### Mobile Mode (<992px)
✅ Fullscreen slider **DISABLED**
- Normal page scroll
- Touch scroll works naturally
- No snap scrolling
- Dot navigation hidden
- Progress bar hidden
- Slides have auto height (min-height: 100vh)

---

## 🔧 Configuration

### Change Breakpoint

In `js/slide.js`:

```javascript
const SliderConfig = {
    breakpoint: 992,  // Change this value (in pixels)
    // ... other settings
};
```

Common breakpoints:
- `1200` - Extra large screens only
- `992` - Large screens and up (default)
- `768` - Medium screens and up
- `576` - Small screens and up

### Disable Responsive Behavior

To keep slider always active regardless of screen size:

```javascript
function shouldEnableSlider() {
    return true; // Always return true
}
```

To keep slider always disabled:

```javascript
function shouldEnableSlider() {
    return false; // Always return false
}
```

---

## 🎨 CSS Classes

The body element gets different classes based on mode:

### Desktop Mode
```html
<body class="slider-ready slider-active">
```

### Mobile Mode
```html
<body class="slider-ready slider-disabled">
```

### Use in CSS

```scss
// Desktop only styles
.slider-active {
    .slide {
        height: 100vh;
    }
}

// Mobile only styles
.slider-disabled {
    .slide {
        height: auto;
        min-height: 100vh;
    }
}
```

---

## 📊 Testing Responsive Behavior

### In Browser DevTools

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select responsive or device preset
4. Test at different widths:
   - **1200px** - Slider active
   - **992px** - Slider active (breakpoint)
   - **991px** - Slider disabled
   - **768px** - Slider disabled
   - **375px** - Slider disabled (mobile)

### Console Logging

The slider logs its state:
- `"Enabling fullscreen slider (Desktop mode)"` - When activated
- `"Disabling fullscreen slider (Mobile mode)"` - When deactivated

### Check Current State

```javascript
// In browser console
console.log(window.Slider.isEnabled()); // true or false
```

---

## 🔄 Automatic Resize Handling

The slider automatically detects window resize and switches modes:

```javascript
// Debounced resize handler (150ms delay)
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
});
```

### What Happens on Resize

**Desktop → Mobile (shrinking window):**
1. Slider deactivates
2. Transform removed (slides reset to normal flow)
3. Dot navigation hidden
4. Event listeners removed
5. Normal scroll enabled

**Mobile → Desktop (expanding window):**
1. Slider activates
2. Goes to first slide
3. Dot navigation shown
4. Event listeners attached
5. Snap scroll enabled

---

## 🎯 Best Practices

### 1. Design for Both Modes

```scss
.hero-section {
    // Base styles for both modes
    padding: 2rem;
    
    // Desktop mode adjustments
    .slider-active & {
        height: 100vh;
        display: flex;
        align-items: center;
    }
    
    // Mobile mode adjustments
    .slider-disabled & {
        height: auto;
        min-height: 100vh;
        padding-top: 4rem;
    }
}
```

### 2. Test Content Overflow

Ensure content fits in both modes:
- Desktop: Fixed 100vh height
- Mobile: Auto height with min-height

### 3. Optimize Images

```html
<picture>
    <!-- Desktop -->
    <source media="(min-width: 992px)" srcset="hero-desktop.jpg">
    
    <!-- Mobile -->
    <source media="(max-width: 991px)" srcset="hero-mobile.jpg">
    
    <img src="hero-desktop.jpg" alt="Hero">
</picture>
```

### 4. Conditional JavaScript

```javascript
window.addEventListener('slideChange', (e) => {
    // Only runs when slider is active
    if (window.Slider.isEnabled()) {
        console.log('Desktop slide change');
    }
});

window.addEventListener('scroll', () => {
    // Only runs when slider is disabled
    if (!window.Slider.isEnabled()) {
        console.log('Mobile scroll');
    }
});
```

---

## 🐛 Troubleshooting

### Slider Not Switching Modes

**Check:**
1. Screen width is crossing the 992px breakpoint
2. Console logs showing mode changes
3. Body classes changing (`slider-active` ↔ `slider-disabled`)

**Solution:**
```javascript
// Force re-check
handleResize();
```

### Content Overlapping on Mobile

**Issue:** Slides designed for 100vh don't work well with auto height

**Solution:**
```scss
.slide {
    .slider-disabled & {
        min-height: 100vh;
        height: auto;
        padding: 4rem 1rem;
    }
}
```

### Scroll Jumping on Resize

**Issue:** Transform applied when switching modes

**Solution:** Already handled by resetting transform:
```javascript
slider.style.transform = 'translateY(0)';
window.scrollTo(0, 0);
```

---

## 📱 Mobile-Specific Features

### Add Scroll Indicator

```html
<div class="scroll-indicator">
    <svg><!-- Down arrow icon --></svg>
</div>
```

```scss
.scroll-indicator {
    display: none;
    
    @media (max-width: 991px) {
        display: block;
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        animation: bounce 2s infinite;
    }
}
```

### Sticky Headers on Mobile

```scss
.header {
    .slider-disabled & {
        position: sticky;
        top: 0;
        z-index: 100;
    }
}
```

---

## 🎮 Manual Control

### Force Enable/Disable

```javascript
// Manually enable (override responsive)
window.Slider.enable();

// Manually disable
window.Slider.disable();

// Check current state
console.log(window.Slider.isEnabled()); // true/false
```

### Lock to One Mode

```javascript
// Lock to desktop mode
SliderConfig.breakpoint = 0; // Always enabled

// Lock to mobile mode
SliderConfig.breakpoint = 99999; // Never enabled
```

---

## 📊 Performance Tips

### 1. Reduce Reflow on Resize

The debounce delay (150ms) prevents excessive recalculations:

```javascript
// Already implemented
setTimeout(handleResize, 150);
```

### 2. Lazy Load Below Fold Content

```javascript
window.addEventListener('slideChange', (e) => {
    if (window.Slider.isEnabled()) {
        // Load next slide images
        const nextSlide = slides[e.detail.currentSlide + 1];
        if (nextSlide) {
            lazyLoadImages(nextSlide);
        }
    }
});
```

### 3. Disable Animations on Mobile

```scss
@media (max-width: 991px) {
    .slide-content {
        animation: none !important;
    }
}
```

---

## ✅ Summary

| Feature | Desktop (≥992px) | Mobile (<992px) |
|---------|-----------------|-----------------|
| Slider | ✅ Active | ❌ Disabled |
| Scroll Type | Snap/Slide | Normal |
| Dot Navigation | ✅ Visible | ❌ Hidden |
| Keyboard Nav | ✅ Yes | ❌ No |
| Mouse Wheel | ✅ Yes | ❌ No |
| Touch Scroll | ❌ No | ✅ Yes |
| Slide Height | 100vh | Auto/Min 100vh |
| Body Class | `slider-active` | `slider-disabled` |

---

## 🔗 Related Files

- `js/slide.js` - Main slider logic
- `scss/layout/_slider.scss` - Responsive styles
- `SLIDER_DOCUMENTATION.md` - Full documentation

---

**Need Help?** Check console logs or use `window.Slider.isEnabled()` to debug!