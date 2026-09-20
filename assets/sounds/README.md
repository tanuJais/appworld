# Lesson sound effects

Drop four short (< 400 ms) mp3 cues here and copy them to the web `public/sounds` folder:

| File | Used for |
| --- | --- |
| `hop.mp3` | Number characters bouncing in (`enter` phase) |
| `click.mp3` | Control bar taps |
| `spark.mp3` | Deviation bubbles colliding (`multiply` phase) |
| `chime.mp3` | Blocks snapping into the final answer (`merge` phase) |

Playback goes through [src/services/soundService.ts](../../src/services/soundService.ts).
Missing files degrade gracefully: native falls back to haptics, web stays silent.
