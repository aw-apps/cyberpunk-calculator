# AGENTS.md

## Goal
Build a cyberpunk-themed calculator web app with neon visuals, glitch effects, and smooth animations.
All computation handled in pure vanilla JavaScript. No external libraries or frameworks.

## Tech Stack
- **Frontend**: Pure HTML5 / CSS3 / Vanilla JavaScript
- **Deploy**: GitHub Pages (root `/`)
- **Dependencies**: None

## Architecture
```
/
|-- index.html      # App entry point and calculator layout
|-- styles.css      # Cyberpunk neon theme, animations, responsive
|-- script.js       # Calculator logic (eval-free, state machine)
```

## Global Acceptance Criteria
- [ ] App loads at https://aw-apps.github.io/cyberpunk-calculator/ without errors
- [ ] All 4 arithmetic operations work correctly
- [ ] Decimal point input works correctly
- [ ] Backspace removes last character
- [ ] Clear (C) clears current input; AC clears all
- [ ] No JavaScript console errors on load or during operation
- [ ] Fully responsive on mobile and desktop
- [ ] Cyberpunk visual theme: dark background, neon colors (#00ffff, #ff00ff, #00ff41)
