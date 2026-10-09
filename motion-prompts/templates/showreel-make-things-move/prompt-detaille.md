<direction>
A 15-second 2D motion design showreel in 16:9, 1920x1080. Alternate between a light grey paper canvas (#EDEDED) and a near-black slate (#1C1F24). Heavy condensed sans-serif type (Anton / Bebas Neue style), one electric blue accent (#2F6BFF) and one signal red (#FF3B4A). Every scene demonstrates one animation principle and is labelled with small handwritten blue annotations and arrows ("slow in, slow out", "squash!", "stagger: 45ms", "overlap", "elastic", "no ease. on purpose.", "follow-through", "anticipation"). A thin timeline scrubber with keyframe diamonds runs along the bottom of every scene, its playhead advancing with the video; a small timecode sits top right.
Banned: stock footage, gradients, glows, random transitions.
</direction>

<structure>
0–2s   Bouncing ball: a blue ball falls with onion-skin ghost trails, squashes on a thin ground line and bounces twice; a dashed arc traces its path. Labels "slow in, slow out" and "squash!".
2–4s   "I MAKE THINGS" then "MOVE." slam in letter by letter (45ms stagger). The ball lands as the period of "MOVE.", a blue underline draws beneath. The period stretches into an ellipse on overlap. Labels "stagger: 45ms", "overlap".
4–5s   Hard cut to dark: "STRETCH" in blue, squashed horizontally with motion blur, springing back. Label "elastic".
5–6s   "SNAP" in red, instant hard cut with thin red construction guides visible. Label "no ease. on purpose."
6–8s   Position/time graph on light canvas: a red linear line ("linear = robotic") with a box sliding at constant spacing below. The label gets crossed out and the line morphs into a blue S-curve ("ease in-out ✓"), the boxes below now bunch at the ends.
8–11s  Wipe to a dark dot grid; a blue arc of dots sweeps across, red and blue dots ripple in its wake. Label "follow-through".
11–13s Circular HUD dial: tick ring, orbiting small squares, a blue dot in the centre; a counter under it counts 17% → 89%. Label "anticipation".
13–15s Back to light: the letters of "MOTION DESIGNER" tumble and rotate into place above a huge "CLAUDE." whose period is the blue dot. Handwritten note "open to new projects" with an arrow to the dot.
</structure>

<build>
1. One HTML file, 1920x1080 at 60fps. Compute every visual from time inside seek(t): no CSS transitions, timers or state carried between frames.
2. Real squash & stretch on the ball (volume preserved), closed-form springs on the type with small overshoots.
3. Draw the easing graphs from the same functions that move the boxes.
4. Handwritten annotations appear with a quick stroke-draw of the arrow, then the text.
5. Hard cuts between light and dark scenes, timed on beats; no dead time.
</build>

<start>
Show me four stills (bouncing ball, MOVE., easing graph, end card) before building the full video.
</start>
