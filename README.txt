SCOUT REGIMENT DECODER APP — STARTER BUILD
==========================================

1. Open index.html in Chrome/Edge/Safari.
2. The BEGIN OPERATION button enters the terminal and starts audio if audio files exist.
3. Game progress is stored in the browser via localStorage.
4. Edit config.js to set final codes for Missions 02–04 and the four Mission 02 headings.
5. Mission 01 is currently set to 5831, based on the established 5→8→3→1 route.
6. Mission 05 is set to SAMEV.
7. Put MP3 files in /audio using the names listed in audio/README.txt.

TESTING
-------
Open index.html?dev=1 to reveal developer controls at the bottom of the mission index.
Developer mode lets you unlock missions and preview the finale before all codes are final.

FILES
-----
index.html   Main page
styles.css   Theme and responsive layout
config.js    Mission titles, codes, hints, success messages, audio paths
app.js       Game logic and progression
assets/      Artwork
 audio/      Your soundtrack and sound effects
