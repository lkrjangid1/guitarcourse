# Artist Songbook Generation Prompt

Copy everything below the line into a fresh Claude conversation. Replace `[ARTIST_NAME]` and the other placeholders with your target artist.

---

## THE PROMPT

I want you to build me an HTML acoustic guitar songbook for **[ARTIST_NAME]** — 52 songs, single self-contained HTML file, using the exact design system from my previous songbooks. Generate it via a Python build script so it's easy to extend later.

### Artist & scope

- **Artist:** [ARTIST_NAME]
- **Era / genre focus:** [e.g. "1990s Bollywood ballads" / "Pakistani ghazals" / "1970s rock acoustic hits" — be specific]
- **Song selection criteria:** Pick 52 of their most iconic and guitar-friendly songs. Spread the years across their active career. Prefer songs that work well on solo acoustic (skip very synth-heavy or electronic-only tracks). All songs must be **genuinely performed by this artist** — no misattributions (verify mentally; if in doubt, leave it out and pick another).
- **No duplicates:** if the same song appears under variant titles, include it once only.

### Design system (must match my existing songbooks exactly)

**Theme & colours:**
- Light theme bg `#faf6ee`, dark theme bg `#14110e`
- Accent: `#c9420f` (light) / `#ee6a32` (dark)
- Theme toggle button top-right, persists via `localStorage` key `[artist-slug]-songbook-theme` (e.g. `kishore-songbook-theme`)
- System dark-mode preference detected on first load

**Typography:**
- Display: Fraunces (italic for emphasis), Body: Outfit, Mono: JetBrains Mono — all loaded from Google Fonts with preconnect

**Chord pills (CSS classes):**
- Required classes with `-bg` and `-ink` variants for both themes: `G` (green), `C` (red), `D` (blue), `Em` (yellow), `Am` (purple), `F` (orange), `Bm` (teal), `A` (pink)
- Format: `<span class="chord G">G</span>`

**Layout:**
- Sticky topbar with brand + nav + theme toggle
- Hero with eyebrow + giant italic h1 + lede + 3-stat row
- Search box in topbar that filters BOTH the song index AND song blocks live
- 52-card grid quick index (clickable cards linking to `#song-N` anchors)
- Each song = one `<article class="song-block">` with id `song-1` through `song-52`
- Sectioned chord chart per song (Verse, Chorus, optionally Bridge/Outro)
- Back-to-top button appearing after scrolling
- IntersectionObserver fade-in for song blocks
- Footer

**Per-song metadata required:**
- Title, movie/album, year, tempo (BPM), time signature (4/4, 3/4, 6/8), capo position, key, difficulty (Beginner/Intermediate)
- Strumming pattern badge (e.g. `D _ DU _ DU` or `D D U U D U`)
- **3 link buttons:**
  1. YouTube tutorial search (red pill) — URL: `https://www.youtube.com/results?search_query={title}+[artist]+guitar+chords+tutorial`
  2. YouTube original audio (red pill) — URL: `https://www.youtube.com/results?search_query={title}+[artist]`
  3. Spotify search (green pill) — URL: `https://open.spotify.com/search/{title}%20[artist]`
- Chord chart with color-coded chord pills next to lyric lines

### Build approach

1. Create a Python file `songs.py` with a `SONGS` list — each song as a dict with all metadata + `sections` list of `(section_name, [(chord, lyric), ...])` tuples.
2. Create a Python file `build.py` that reads `songs.py` and emits a single `[artist-slug]_songbook.html` file with all styling inlined (no external CSS file — the songbook must be a self-contained single file).
3. Run the build script, verify the HTML is valid (DOCTYPE, balanced tags, ~3000+ lines, ~190+ KB), and copy to `/mnt/user-data/outputs/`.

### Hero stats (3 numbers/labels)

- Number 1: `{total}` / "Songs"
- Number 2: `{beginner_count}` / "Beginner-Friendly"
- Number 3: `∞` / "[Artist-specific phrase — e.g. 'Cups of Chai' for cosy artists, 'Yodels & Yaads' for Kishore, 'Soul Hours' for soul artists]"

### Tone / copy

- Hero h1: `[Artist Name]<br/><em>on the acoustic guitar.</em>`
- Lede: one-paragraph description mentioning the song count, calling out beginner friendliness, and one distinctive note about the artist's style.
- Footer: artist name + one tagline line

### Hard rules

- One HTML file, fully self-contained, no external dependencies except Google Fonts
- Light & dark theme both fully styled — test both
- No emojis in headers or song titles
- All 52 songs must have **at least one Verse and one Chorus section** with chord+lyric pairs
- Lyrics should be in the **original script transliterated to Latin** for Hindi/Urdu songs, original English for English-language songs
- Chord pills must use the right colour class — if a song uses `F` or `Am`, use those classes (don't use a fallback)
- Difficulty `Beginner` for songs using only 4–5 open chords; `Intermediate` for songs needing capo, barre, or 6+ chords
- **Honest about lesser-known songs:** if a song is iconic but rarely played acoustic, note it briefly in the chord chart intro

### Output expected

When done, present:
1. The final `[artist-slug]_songbook.html` file path
2. Brief summary: total songs, year range, count of beginner vs intermediate, list of the most notable inclusions
3. Honest notes: any songs that were tricky to verify, any compromises in the chord arrangements, any songs you removed and why

### Optional flags I may add

- "Include Hindi songs only" / "Include English songs only"
- "Bias toward [decade]"
- "Skip duets" / "Include duets"
- "Use capo where possible to keep beginner-friendly"
- "Add a comments column for each song explaining the historical context"

---

### Quick-start examples

**Generate a Lata Mangeshkar songbook:**
> Build me a Lata Mangeshkar songbook (52 songs, 1949–1990 golden era, prefer her solos over duets, capo where helpful to keep beginner-friendly).

**Generate a Mohammed Rafi songbook:**
> Build me a Mohammed Rafi songbook (52 songs, 1950–1980 golden era, mix of romantic ballads and his peppy Shammi Kapoor-era hits).

**Generate an Ed Sheeran songbook:**
> Build me an Ed Sheeran songbook (52 songs, his full discography, prefer acoustic-friendly originals over collaborations, mostly G/D/C/Em/Am tonality).

**Generate a Jagjit Singh ghazal songbook:**
> Build me a Jagjit Singh ghazal songbook (52 songs, full career, 3/4 and 6/8 time signatures expected for ghazal feel, hero phrase should mention "ghazals" not "songs").
