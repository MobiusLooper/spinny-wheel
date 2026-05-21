# Spinny Wheel.exe

A tiny static standup-order wheel. It runs from plain files and is ready for GitHub Pages.

## Use

Open `index.html` in a browser, paste one person per line, then press `SPIN!!!!`.

The app samples without replacement by default: once someone is picked, they leave the active wheel until `RESET ROUND`. Picks, roster text, mute state, and the current wheel angle are saved in `localStorage`.

## Customize For Your Team

Fork this repo, then point your coding agent at `CUSTOMIZE_WITH_AI.md`. It tells the agent what to ask for, how to use Slack context, and which fields in `team-content.js` to refresh.

Team-specific content lives in `team-content.js`. The wheel mechanics live in `app.js`.

## Host On GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, go to Pages.
3. Choose the `main` branch and `/root` as the source.
4. Save, then open the Pages URL GitHub gives you.

No build command or package install is needed.
