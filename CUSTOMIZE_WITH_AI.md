# Customize Spinny Wheel For A Team

You are helping a user customize this fork of Spinny Wheel for their team. The app is a static GitHub Pages site. Do not change the wheel mechanics, styling, storage behavior, or deployment setup unless the user explicitly asks.

Your main job is to refresh the content in `team-content.js`.

## First, Ask The User

Before editing files, ask the user for these inputs:

1. Team or squad name.
   - This becomes `squadName`.
   - It is the page header shown above `SPINNY WHEEL.EXE`.

2. Regular standup attendees.
   - Ask for the names people commonly use in standup.
   - These become `fallbackPeople`.
   - Keep the spelling consistent with how people should appear on the wheel.

3. Relevant Slack channels.
   - Ask for public or private channel names where this squad talks.
   - Ask which channels are most useful for team jokes, project context, incidents, demos, launches, retros, or recurring standup topics.

4. Person-specific context.
   - Ask if any attendees have recurring work themes, projects, harmless catchphrases, tools, tickets, dashboards, or recurring topics that should appear in fake ads.
   - Make clear that the best fake ads come from low-stakes work context, not personal or sensitive topics.

5. Squad memes and themes.
   - Ask for acronyms, project names, services, rituals, product areas, incidents, dashboards, metrics, launch names, recurring bugs, funny error messages, or meeting habits.
   - Ask for any phrases the team says a lot.

6. Content boundaries.
   - Ask what to avoid.
   - Avoid health, HR, performance, protected traits, layoffs, compensation, personal relationships, private gossip, or anything that would make a teammate feel singled out.

7. Tone.
   - Ask whether the user wants the humor to be chaotic, dry, corporate-parody, surreal, gentle, brutal-but-safe, or close to the current style.

If the user gives incomplete answers, ask the smallest useful follow-up. Do not block forever. You can still create a good first pass from names, team name, and a few project keywords.

## Slack Research

If Slack tools are available and the user permits Slack access, use them before writing the final content.

Search for:

- The regular standup attendee names.
- The team or squad name.
- The Slack channel names the user gave you.
- Project names, service names, acronyms, incidents, dashboards, and recurring terms the user mentions.

Use Slack results to find:

- Topics that appear repeatedly.
- Phrases the team actually uses.
- Work-safe friction points, such as flaky dashboards, recurring alerts, confusing metrics, deploy rituals, backlog themes, naming debates, or mysterious tickets.
- Person-specific work themes that are funny but not invasive.

Do not quote private Slack messages directly in the app. Convert context into original parody copy. If Slack access is unavailable, ask the user for examples instead.

## What To Edit

Edit `team-content.js`, specifically `window.SPINNY_CONTENT`.

Keep the JavaScript valid. Preserve the object shape and trailing commas style already used in the file.

Refresh these fields:

- `squadName`: Team name shown above `SPINNY WHEEL.EXE`.
- `fallbackPeople`: Default wheel names, one string per regular attendee.
- `winnerPhrases`: Short winner lines. Each one should include `{name}`.
- `finalWheelLabels`: Labels for the final remaining person. Each one should include `{name}`.
- `sendoffMessages`: End-of-round messages after everyone has gone.
- `squadLore`: Short all-caps or punchy fragments used in overlays.
- `targetedAds`: Fake ads that can target specific standup attendees.
- `winnerBadges`: Short badge text for winner overlays.
- `sendoffStamps`: Short stamp text for the final overlay.
- `sendoffSubtitles`: Small final-overlay subtitles.
- `crashMessages`: Lines for the fake crash screen after the final sendoff.

Do not edit `app.js` unless the user asks for app behavior changes.

## Fake Ad Rules

The fake ads are the best part. Make them specific to people and squad context.

Each item in `targetedAds` must have:

```js
{
  eyebrow: "Sponsored",
  target: "Name",
  headline: "Short funny problem?",
  body: "One sentence of fake product copy.",
  product: "Fake Product Name",
  cta: "Short action",
  lore: "SHORT LORE FRAGMENT"
}
```

Guidelines:

- Create at least one ad for each regular attendee when possible.
- `target` should match the person's wheel name or the first name used in `fallbackPeople`.
- Ads are selected by matching `target` against wheel names, so keep names aligned.
- `headline` should sound like a terrible targeted ad for that person's recurring work topic.
- `body` should be specific, absurd, and work-safe.
- `product` should be a fake SaaS/tool/product name.
- `cta` should be short and button-like.
- `lore` should be a short fragment that can also appear in winner overlays.

Good ad material:

- Project names.
- Service names.
- Dashboards.
- Alerts.
- Metrics.
- Deploy rituals.
- PR review habits.
- Test failures.
- Planning rituals.
- Standup habits.
- Product terminology.
- Funny acronyms.

Bad ad material:

- Sensitive personal traits.
- Real performance criticism.
- Confidential customer data.
- HR topics.
- Medical, family, relationship, financial, or identity-based jokes.
- Anything meaner than the team would say about itself.

## Content Style

The current app style is loud, strange, and meeting-adjacent. Keep content short because it appears in small UI surfaces.

Use:

- Many short phrases.
- Fake corporate tools.
- Absurd product names.
- Over-specific squad references.
- Work-safe inside jokes.
- `{name}` placeholders in winner and final labels.
- A mix of general team lines and person-specific ads.

Avoid:

- Long paragraphs.
- Explaining the joke.
- Markdown inside strings.
- Smart quotes or unusual punctuation.
- Changing HTML/CSS/JS outside `team-content.js`.

## Suggested Content Counts

Aim for:

- `fallbackPeople`: all regular standup attendees.
- `winnerPhrases`: 30 to 60 lines.
- `finalWheelLabels`: 5 to 10 lines.
- `sendoffMessages`: 20 to 35 lines.
- `squadLore`: 30 to 60 fragments.
- `targetedAds`: 1 to 3 ads per regular attendee.
- `winnerBadges`: 8 to 14 short badges.
- `sendoffStamps`: 6 to 10 short stamps.
- `sendoffSubtitles`: 5 to 10 short subtitles.
- `crashMessages`: 8 to 12 lines.

Smaller teams can use fewer ads, but every regular attendee should ideally have at least one.

## Verification

After editing:

1. Run `node --check team-content.js`.
2. Open `index.html` locally or use the existing browser tab.
3. Confirm the header above `SPINNY WHEEL.EXE` shows the new team name.
4. Confirm the default people list is correct on a fresh browser profile or after clearing this app's `localStorage`.
5. Spin through several people and check that winner overlays, ads, lore, and sendoffs look right.

Note: the app stores the user's pasted names in `localStorage`. If the default roster does not appear after editing `fallbackPeople`, clear local storage or use a fresh browser profile.
