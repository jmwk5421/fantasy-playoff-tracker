// ============================================
// FANTASY PLAYOFF TRACKER - CONFIGURATION
// ============================================
// Edit this file to customize your league!

// Your 6 Fantasy Players
const FANTASY_PLAYERS = [
    { id: 1, name: "Stoler" },
    { id: 2, name: "Kilborne" },
    { id: 3, name: "Greer" },
    { id: 4, name: "Hirschl" },
    { id: 5, name: "Rob" },
    { id: 6, name: "Sunny" }
];

// NFL Teams - full list
const NFL_TEAMS = {
    KC: { name: "Chiefs" },
    BUF: { name: "Bills" },
    BAL: { name: "Ravens" },
    HOU: { name: "Texans" },
    DEN: { name: "Broncos" },
    PIT: { name: "Steelers" },
    LAC: { name: "Chargers" },
    DET: { name: "Lions" },
    PHI: { name: "Eagles" },
    TB: { name: "Buccaneers" },
    LAR: { name: "Rams" },
    MIN: { name: "Vikings" },
    WAS: { name: "Commanders" },
    GB: { name: "Packers" },
    SF: { name: "49ers" },
    CHI: { name: "Bears" },
    NE: { name: "Patriots" },
    NYJ: { name: "Jets" },
    SEA: { name: "Seahawks" },
    JAX: { name: "Jaguars" },
    LV: { name: "Raiders" },
    CAR: { name: "Panthers" }
};

// 2025-26 NFL Playoff Teams by Round
// AFC: (1) Broncos, (2) Patriots, (3) Jaguars, (4) Steelers, (5) Texans, (6) Bills, (7) Chargers
// NFC: (1) Seahawks, (2) Bears, (3) Eagles, (4) Panthers, (5) Rams, (6) 49ers, (7) Packers
const TEAMS_BY_ROUND = {
    // Wild Card: 12 teams (1 seeds DEN & SEA have byes)
    wildcard: ["NE", "JAX", "PIT", "HOU", "BUF", "LAC", "CHI", "PHI", "CAR", "LAR", "SF", "GB"],
    // Divisional: 8 teams remaining (1 & 2 seeds + wild card winners)
    divisional: ["DEN", "NE", "HOU", "BUF", "SEA", "CHI", "LAR", "SF"],
    // Championship: Update after divisional round
    championship: ["DEN", "NE", "HOU", "SEA", "LAR", "CHI"],  // All teams not yet eliminated
    // Super Bowl: Update after championship round
    superbowl: ["DEN", "NE", "HOU", "SEA", "LAR", "CHI"]  // All teams not yet eliminated
};

// Teams on bye each round (1 seeds in wild card)
const BYE_TEAMS_BY_ROUND = {
    wildcard: ["DEN", "SEA"],
    divisional: [],
    championship: [],
    superbowl: []
};

// Snake Draft Results (6 players x 8 rounds = 48 picks)
// Draft order: 1,2,3,4,5,6,6,5,4,3,2,1,1,2,3,4,5,6...
//
// INSTRUCTIONS: Replace the sample players below with your actual draft picks.
// Format: { name: "Player Name", team: "TEAM_CODE", position: "POS" }
// Positions: QB, RB, WR, TE, K, DEF

const DRAFT_PICKS = {
    // Stoler's roster
    1: [
        { name: "Puka Nacua", team: "LAR", position: "WR" },
        { name: "CJ Stroud", team: "HOU", position: "QB" },
        { name: "Saquon Barkley", team: "PHI", position: "RB" },
        { name: "Nico Collins", team: "HOU", position: "WR" },
        { name: "Josh Jacobs", team: "GB", position: "RB" },
        { name: "Woody Marks", team: "HOU", position: "RB" },
        { name: "Parker Washington", team: "JAX", position: "WR" },
        { name: "Luther Burden", team: "CHI", position: "WR" }
    ],

    // Kilborne's roster
    2: [
        { name: "Jalen Hurts", team: "PHI", position: "QB" },
        { name: "Kyren Williams", team: "LAR", position: "RB" },
        { name: "AJ Brown", team: "PHI", position: "WR" },
        { name: "TreVeyon Henderson", team: "NE", position: "RB" },
        { name: "Courtland Sutton", team: "DEN", position: "WR" },
        { name: "Devonta Smith", team: "PHI", position: "WR" },
        { name: "Hunter Henry", team: "NE", position: "WR" },
        { name: "Troy Franklin", team: "DEN", position: "WR" }
    ],

    // Greer's roster
    3: [
        { name: "Jaxon Smith-Njigba", team: "SEA", position: "WR" },
        { name: "Trevor Lawrence", team: "JAX", position: "QB" },
        { name: "Travis Etienne", team: "JAX", position: "RB" },
        { name: "Caleb Williams", team: "CHI", position: "QB" },
        { name: "Kenneth Walker", team: "SEA", position: "RB" },
        { name: "D'Andre Swift", team: "CHI", position: "RB" },
        { name: "Colston Loveland", team: "CHI", position: "WR" },
        { name: "Jakobi Meyers", team: "JAX", position: "WR" }
    ],

    // Hirschl's roster
    4: [
        { name: "Matthew Stafford", team: "LAR", position: "QB" },
        { name: "Davante Adams", team: "LAR", position: "WR" },
        { name: "Bo Nix", team: "DEN", position: "QB" },
        { name: "Justin Herbert", team: "LAC", position: "QB" },
        { name: "RJ Harvey", team: "DEN", position: "RB" },
        { name: "Aaron Rodgers", team: "PIT", position: "QB" },
        { name: "Tyler Higbee", team: "LAR", position: "WR" },
        { name: "Kenneth Gainwell", team: "PIT", position: "RB" }
    ],

    // Rob's roster
    5: [
        { name: "Drake Maye", team: "NE", position: "QB" },
        { name: "Sam Darnold", team: "SEA", position: "QB" },
        { name: "Rhamondre Stevenson", team: "NE", position: "RB" },
        { name: "Jordan Love", team: "GB", position: "QB" },
        { name: "Stefon Diggs", team: "NE", position: "WR" },
        { name: "Christian Watson", team: "GB", position: "WR" },
        { name: "Blake Corum", team: "LAR", position: "RB" },
        { name: "AJ Barner", team: "SEA", position: "WR" }
    ],

    // Sunny's roster
    6: [
        { name: "Josh Allen", team: "BUF", position: "QB" },
        { name: "James Cook", team: "BUF", position: "RB" },
        { name: "Christian McCaffrey", team: "SF", position: "RB" },
        { name: "Brock Purdy", team: "SF", position: "QB" },
        { name: "George Kittle", team: "SF", position: "WR" },
        { name: "Rome Odunze", team: "CHI", position: "WR" },
        { name: "Zach Charbonnet", team: "SEA", position: "RB" },
        { name: "Khalil Shakir", team: "BUF", position: "WR" }
    ]
};

// Scoring Settings (0.5 PPR)
const SCORING = {
    // Passing
    passingYards: 0.04,      // 1 point per 25 yards
    passingTD: 4,
    interception: -2,

    // Rushing
    rushingYards: 0.1,       // 1 point per 10 yards
    rushingTD: 6,

    // Receiving (0.5 PPR)
    reception: 0.5,
    receivingYards: 0.1,     // 1 point per 10 yards
    receivingTD: 6,

    // Kicking
    fgMade0_39: 3,
    fgMade40_49: 4,
    fgMade50Plus: 5,
    xpMade: 1,
    fgMissed: -1,
    xpMissed: -1,

    // Defense
    sack: 1,
    defInterception: 2,
    fumbleRecovery: 2,
    defensiveTD: 6,
    safety: 2,
    blockedKick: 2,

    // Misc
    fumbleLost: -2,
    twoPointConversion: 2
};

// Playoff Rounds and Lineup Requirements
const PLAYOFF_ROUNDS = {
    wildcard: {
        name: "Wild Card",
        slots: [
            { id: "qb1", label: "QB", positions: ["QB"] },
            { id: "rb1", label: "RB", positions: ["RB"] },
            { id: "wr1", label: "WR", positions: ["WR"] },
            { id: "wr2", label: "WR", positions: ["WR"] },
            { id: "flex1", label: "FLEX", positions: ["QB", "RB", "WR"] },
            { id: "flex2", label: "FLEX", positions: ["QB", "RB", "WR"] }
        ]
    },
    divisional: {
        name: "Divisional",
        slots: [
            { id: "qb1", label: "QB", positions: ["QB"] },
            { id: "rb1", label: "RB", positions: ["RB"] },
            { id: "wr1", label: "WR", positions: ["WR"] },
            { id: "wr2", label: "WR", positions: ["WR"] },
            { id: "flex1", label: "FLEX", positions: ["QB", "RB", "WR"] },
            { id: "flex2", label: "FLEX", positions: ["QB", "RB", "WR"] }
        ]
    },
    championship: {
        name: "Conference Championship",
        slots: [
            { id: "rb1", label: "RB", positions: ["RB"] },
            { id: "wr1", label: "WR", positions: ["WR"] },
            { id: "flex1", label: "FLEX", positions: ["QB", "RB", "WR"] },
            { id: "flex2", label: "FLEX", positions: ["QB", "RB", "WR"] }
        ]
    },
    superbowl: {
        name: "Super Bowl",
        slots: [
            { id: "flex1", label: "FLEX", positions: ["QB", "RB", "WR"] },
            { id: "flex2", label: "FLEX", positions: ["QB", "RB", "WR"] },
            { id: "flex3", label: "FLEX", positions: ["QB", "RB", "WR"] }
        ]
    }
};

// Current active round
let currentRound = "wildcard";

// Starting lineups storage
// Format: { visibleRound: { fantasyPlayerId: { slotId: "NFL Player Name", ... } } }
let startingLineups = {};

// Player stats storage - will be populated as you enter stats
// Format: { round: { "Player Name": { passingYards: 0, ... } } }
let playerStats = {
    // Wild Card Round Stats (pulled from ESPN/Pro Football Reference)
    wildcard: {
        // Rams 34, Panthers 31
        "Matthew Stafford": { passingYards: 304, passingTD: 3, interceptions: 1 },
        "Kyren Williams": { rushingYards: 57, receptions: 2, receivingYards: 18, receivingTD: 1 },
        "Puka Nacua": { receptions: 10, receivingYards: 111, receivingTD: 1, rushingYards: 14, rushingTD: 1 },
        "Blake Corum": { rushingYards: 45, receptions: 2, receivingYards: 13 },
        "Tyler Higbee": { receptions: 2, receivingYards: 45 },
        // Bears 31, Packers 27
        "Caleb Williams": { passingYards: 361, passingTD: 2, interceptions: 2, rushingYards: 20, twoPointConversions: 1 },
        "D'Andre Swift": { rushingYards: 54, rushingTD: 1, receptions: 2, receivingYards: 38 },
        "Luther Burden": { receptions: 3, receivingYards: 42 },
        "Rome Odunze": { receptions: 2, receivingYards: 44 },
        "Colston Loveland": { receptions: 8, receivingYards: 137, twoPointConversions: 1 },
        "Jordan Love": { passingYards: 323, passingTD: 4 },
        "Josh Jacobs": { rushingYards: 55, receptions: 1, receivingYards: 3 },
        "Christian Watson": { receptions: 3, receivingYards: 36, receivingTD: 1 },
        // Bills 27, Jaguars 24
        "Josh Allen": { passingYards: 273, passingTD: 1, rushingYards: 33, rushingTD: 2 },
        "James Cook": { rushingYards: 46, receptions: 2, receivingYards: 5 },
        "Khalil Shakir": { receptions: 12, receivingYards: 82 },
        "Trevor Lawrence": { passingYards: 207, passingTD: 3, interceptions: 2, rushingYards: 31 },
        "Travis Etienne": { rushingYards: 67, receptions: 5, receivingYards: 49, receivingTD: 1 },
        "Parker Washington": { receptions: 7, receivingYards: 107, receivingTD: 1 },
        "Jakobi Meyers": { receptions: 1, receivingYards: 12 },
        // 49ers 23, Eagles 19
        "Brock Purdy": { passingYards: 262, passingTD: 2, interceptions: 2 },
        "Saquon Barkley": { rushingYards: 106, receptions: 3, receivingYards: 25 },
        "Jalen Hurts": { passingYards: 168, passingTD: 1, rushingYards: 14 },
        "AJ Brown": { receptions: 3, receivingYards: 25 },
        "Devonta Smith": { receptions: 8, receivingYards: 70 },
        "Christian McCaffrey": { rushingYards: 48, receptions: 6, receivingYards: 66, receivingTD: 2 },
        "George Kittle": { receptions: 4, receivingYards: 45 },
        // Texans 30, Steelers 6
        "CJ Stroud": { passingYards: 250, passingTD: 1, interceptions: 1 },
        "Woody Marks": { rushingYards: 112, rushingTD: 1 },
        "Nico Collins": { receptions: 3, receivingYards: 21 },
        "Aaron Rodgers": { passingYards: 146, interceptions: 1, fumblesLost: 1 },
        "Kenneth Gainwell": { rushingYards: 20, receptions: 4, receivingYards: 26 },
        // Rams 34, Panthers 31 (additional)
        "Davante Adams": { receptions: 5, receivingYards: 72 },
        // Patriots 16, Chargers 3
        "Drake Maye": { passingYards: 268, passingTD: 1, rushingYards: 66, fumblesLost: 1 },
        "Rhamondre Stevenson": { rushingYards: 53, receptions: 3, receivingYards: 75 },
        "Stefon Diggs": { receptions: 2, receivingYards: 16 },
        "Hunter Henry": { receptions: 3, receivingYards: 64, receivingTD: 1 },
        "TreVeyon Henderson": { rushingYards: 27, receptions: 1, receivingYards: 9 },
        "Justin Herbert": { passingYards: 159, rushingYards: 57, fumblesLost: 1 }
    },
    // Divisional Round Stats (pulled from ESPN - some games still in progress)
    divisional: {
        // Broncos 33, Bills 30 (OT)
        "Bo Nix": { passingYards: 279, passingTD: 3, interceptions: 1, rushingYards: 29 },
        "Josh Allen": { passingYards: 283, passingTD: 3, interceptions: 2, rushingYards: 66, fumblesLost: 2 },
        "James Cook": { rushingYards: 117, fumblesLost: 1 },
        "Khalil Shakir": { receptions: 7, receivingYards: 75 },
        "Courtland Sutton": { receptions: 4, receivingYards: 53 },
        "RJ Harvey": { rushingYards: 20, receptions: 5, receivingYards: 46 },
        // Seahawks 41, 49ers 6
        "Sam Darnold": { passingYards: 124, passingTD: 1 },
        "Jaxon Smith-Njigba": { receptions: 3, receivingYards: 19, receivingTD: 1 },
        "Kenneth Walker": { rushingYards: 116, rushingTD: 3 },
        "Zach Charbonnet": { rushingYards: 20, receptions: 5, receivingYards: 20 },
        "AJ Barner": { receptions: 1, receivingYards: 2 },
        "Brock Purdy": { passingYards: 140, interceptions: 1, fumblesLost: 1 },
        "Christian McCaffrey": { rushingYards: 35 },
        // Patriots 28, Texans 16
        "CJ Stroud": { passingYards: 212, passingTD: 1, interceptions: 4, rushingYards: 11 },
        "Woody Marks": { rushingYards: 17, receptions: 2, receivingYards: 19, fumblesLost: 1 },
        "Drake Maye": { passingYards: 179, passingTD: 3, interceptions: 1, rushingYards: 10, fumblesLost: 2 },
        "Rhamondre Stevenson": { rushingYards: 70, receptions: 4, receivingYards: 11 },
        "TreVeyon Henderson": { rushingYards: 25, receptions: 1, receivingYards: -2 },
        "Stefon Diggs": { receptions: 4, receivingYards: 40, receivingTD: 1 },
        "Hunter Henry": { receptions: 1, receivingYards: 5 }
        // Rams vs Bears - not yet played
    }
};

// Load saved data from localStorage if available
function loadSavedData() {
    const savedStats = localStorage.getItem('fantasyPlayoffStats');
    const savedLineups = localStorage.getItem('fantasyPlayoffLineups');
    const savedRound = localStorage.getItem('fantasyPlayoffCurrentRound');

    // Merge saved stats with default stats (saved stats take priority)
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        for (const round in parsed) {
            if (!playerStats[round]) {
                playerStats[round] = {};
            }
            Object.assign(playerStats[round], parsed[round]);
        }
    }
    if (savedLineups) {
        startingLineups = JSON.parse(savedLineups);
    }
    if (savedRound) {
        currentRound = savedRound;
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('fantasyPlayoffStats', JSON.stringify(playerStats));
}

// Save lineups to localStorage
function saveLineups() {
    localStorage.setItem('fantasyPlayoffLineups', JSON.stringify(startingLineups));
}

// Save current round to localStorage
function saveCurrentRound() {
    localStorage.setItem('fantasyPlayoffCurrentRound', currentRound);
}

// Initialize on load
loadSavedData();
