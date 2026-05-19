# Spinny Wheel.exe

A tiny static standup-order wheel. It runs from plain files and is ready for GitHub Pages.

## Use

Open `index.html` in a browser, paste one person per line, then press `SPIN!!!!`.

The app samples without replacement by default: once someone is picked, they leave the active wheel until `RESET ROUND`. Picks, roster text, mute state, and the current wheel angle are saved in `localStorage`.

## Host On GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, go to Pages.
3. Choose the `main` branch and `/root` as the source.
4. Save, then open the Pages URL GitHub gives you.

No build command or package install is needed.
