/* ============================================================
   ROAD TO DOOMSDAY — MISSION DATA
   ------------------------------------------------------------
   Edit this array to add / remove / reorder titles.
   Fields:
     id        : unique stable string (used for localStorage keys)
     seq       : display sequence number
     title     : display title
     year      : release year
     type      : "Movie" | "Series"
     typeNote  : optional extra label (e.g. "Seasons 1 & 2")
     desc      : short mission-style description
     link      : external watch URL (opens in a new tab)
     poster    : image URL or null → renders a cinematic placeholder.
                 Drop a file in images/posters/ and reference it here,
                 e.g. poster: "images/posters/x-men-2000.jpg"
   ============================================================ */

const DOOMSDAY_TITLES = [
  {
    id: "x-men-2000",
    seq: 1,
    title: "X-Men",
    year: 2000,
    type: "Movie",
    phase: "Legacy",
    typeNote: null,
    desc: "First contact. The world learns that mutants walk among us — and that evolution has picked a side. The earliest recorded anomaly in the timeline.",
    link: "https://nepu.io/movie/x-men-2000-2000-190864",
    poster: null
  },
  {
    id: "x2-x-men-united",
    seq: 2,
    title: "X2: X-Men United",
    year: 2003,
    type: "Movie",
    phase: "Legacy",
    typeNote: null,
    desc: "The mutant conflict escalates. Enemies become allies as humanity's fear turns into open war. The fracture lines begin to spread.",
    link: "https://nepu.io/movie/x2-x-men-united-2003-2003-190910",
    poster: null
  },
  {
    id: "captain-america-tfa",
    seq: 3,
    title: "Captain America: The First Avenger",
    year: 2011,
    type: "Movie",
    phase: "Phase 1",
    typeNote: null,
    desc: "1943. A super-soldier is born, and the Tesseract enters human hands. The first Infinity Stone surfaces — the countdown quietly begins.",
    link: "https://nepu.io/movie/captain-america-the-first-avenger-2011-2011-166227",
    poster: null
  },
  {
    id: "the-avengers",
    seq: 4,
    title: "The Avengers",
    year: 2012,
    type: "Movie",
    phase: "Phase 1",
    typeNote: null,
    desc: "Earth's mightiest heroes assemble for the Battle of New York. Somewhere beyond the stars, a Titan takes notice.",
    link: "https://nepu.io/movie/the-avengers-2012-2012-183170",
    poster: null
  },
  {
    id: "avengers-infinity-war",
    seq: 5,
    title: "Avengers: Infinity War",
    year: 2018,
    type: "Movie",
    phase: "Phase 3",
    typeNote: null,
    desc: "Thanos arrives. The snap erases half of all life in the universe. The single greatest catastrophe on record — until now.",
    link: "https://nepu.io/movie/avengers-infinity-war-2018-2018-203243",
    poster: null
  },
  {
    id: "avengers-endgame",
    seq: 6,
    title: "Avengers: Endgame",
    year: 2019,
    type: "Movie",
    phase: "Phase 3",
    typeNote: null,
    desc: "Time itself is weaponized to undo the snap. Victory — at a cost. Branch timelines splinter off. The multiverse is no longer theoretical.",
    link: "https://nepu.io/movie/avengers-endgame-2019-2019-203240",
    poster: null
  },
  {
    id: "loki",
    seq: 7,
    title: "Loki",
    year: 2021,
    type: "Series",
    phase: "Phase 4",
    typeNote: "Seasons 1 & 2",
    desc: "The TVA, He Who Remains, and the death of the Sacred Timeline. Every variant of Kang is now loose. Every timeline is now in play.",
    link: "https://nepu.io/show/loki-2021-2021-234031",
    poster: null
  },
  {
    id: "shang-chi",
    seq: 8,
    title: "Shang-Chi and the Legend of the Ten Rings",
    year: 2021,
    type: "Movie",
    phase: "Phase 4",
    typeNote: null,
    desc: "The Ten Rings awaken and broadcast a signal to... something. Origin unknown. Purpose unknown. Threat classification: pending.",
    link: "https://nepu.io/movie/shang-chi-and-the-legend-of-the-ten-rings-2021-2021-209450",
    poster: null
  },
  {
    id: "spider-man-nwh",
    seq: 9,
    title: "Spider-Man: No Way Home",
    year: 2021,
    type: "Movie",
    phase: "Phase 4",
    typeNote: null,
    desc: "A broken spell tears holes between universes. Visitors from other realities cross over. The walls between worlds are officially failing.",
    link: "https://nepu.io/movie/spider-man-no-way-home-2021-2021-161562",
    poster: null
  },
  {
    id: "wakanda-forever",
    seq: 10,
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    type: "Movie",
    phase: "Phase 4",
    typeNote: null,
    desc: "A kingdom mourns its king as a hidden empire rises from the deep. Vibranium is no longer Wakanda's secret alone.",
    link: "https://nepu.io/movie/black-panther-wakanda-forever-2022-2022-161438",
    poster: null
  },
  {
    id: "doctor-strange-mom",
    seq: 11,
    title: "Doctor Strange in the Multiverse of Madness",
    year: 2022,
    type: "Movie",
    phase: "Phase 4",
    typeNote: null,
    desc: "Incursions confirmed. Universes can collide — and die. Strange learns the cost of dreamwalking across realities.",
    link: "https://nepu.io/movie/doctor-strange-in-the-multiverse-of-madness-2022-2022-161538",
    poster: null
  },
  {
    id: "deadpool-wolverine",
    seq: 12,
    title: "Deadpool & Wolverine",
    year: 2024,
    type: "Movie",
    phase: "Phase 5",
    typeNote: null,
    desc: "The TVA comes knocking. Dying timelines, discarded heroes, and the Void. Worlds are being pruned — and someone is keeping score.",
    link: "https://nepu.io/movie/deadpool-and-wolverine-2024-2024-195881",
    poster: null
  },
  {
    id: "cap-brave-new-world",
    seq: 13,
    title: "Captain America: Brave New World",
    year: 2025,
    type: "Movie",
    phase: "Phase 5",
    typeNote: null,
    desc: "A new Captain America. A celestial mass in the Indian Ocean. Adamantium changes the global balance of power overnight.",
    link: "https://nepu.io/movie/captain-america-brave-new-world-2025-2025-198185",
    poster: null
  },
  {
    id: "thunderbolts",
    seq: 14,
    title: "Thunderbolts*",
    year: 2025,
    type: "Movie",
    phase: "Phase 5",
    typeNote: null,
    desc: "Misfits, assassins, and a being called the Void. A new team is forged in the dark — the world will call them something else entirely.",
    link: "https://nepu.io/movie/thunderbolts-2025-2025-199670",
    poster: null
  },
  {
    id: "fantastic-four",
    seq: 15,
    title: "The Fantastic Four: First Steps",
    year: 2025,
    type: "Movie",
    phase: "Phase 5",
    typeNote: null,
    desc: "Another Earth. Another era. Marvel's first family faces a devourer of worlds — and their story collides with everything that comes next.",
    link: "https://nepu.io/movie/the-fantastic-four-first-steps-2025-2025-213675",
    poster: null
  }
];
