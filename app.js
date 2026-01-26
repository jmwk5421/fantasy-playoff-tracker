// ============================================
// FANTASY PLAYOFF TRACKER - MAIN APPLICATION
// ============================================

// DOM Elements
const standingsContainer = document.getElementById('standings');
const overallStandingsContainer = document.getElementById('overallStandings');
const topPerformersContainer = document.getElementById('topPerformers');
const rostersContainer = document.getElementById('rosters');
const lineupsContainer = document.getElementById('lineups');
const currentRoundName = document.getElementById('currentRoundName');
const currentRoundStandingsName = document.getElementById('currentRoundStandingsName');
const lineupInfo = document.getElementById('lineupInfo');
const roundTabs = document.getElementById('roundTabs');
const modal = document.getElementById('scoreModal');
const lineupModal = document.getElementById('lineupModal');
const nflPlayerSelect = document.getElementById('nflPlayerSelect');
const statsForm = document.getElementById('statsForm');
const lineupSlots = document.getElementById('lineupSlots');
const lineupModalTeam = document.getElementById('lineupModalTeam');

let currentEditingTeamId = null;

// Initialize round tabs
function initRoundTabs() {
    const tabs = roundTabs.querySelectorAll('.round-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const round = tab.dataset.round;
            switchRound(round);
        });
    });
    updateRoundTabsUI();
}

// Switch to a different round
function switchRound(round) {
    currentRound = round;
    saveCurrentRound();
    updateRoundTabsUI();
    renderAll();
}

// Update round tabs UI
function updateRoundTabsUI() {
    const tabs = roundTabs.querySelectorAll('.round-tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.round === currentRound);
    });
    currentRoundName.textContent = PLAYOFF_ROUNDS[currentRound].name;
    currentRoundStandingsName.textContent = PLAYOFF_ROUNDS[currentRound].name;

    // Update lineup info text based on current round's slots
    const slots = PLAYOFF_ROUNDS[currentRound].slots;
    const slotLabels = slots.map(s => s.label).join(', ');
    lineupInfo.textContent = `Each team starts: ${slotLabels}. Only started players earn points.`;
}

// Get stats for current round
function getRoundStats() {
    if (!playerStats[currentRound]) {
        playerStats[currentRound] = {};
    }
    return playerStats[currentRound];
}

// Get lineups for current round
function getRoundLineups() {
    if (!startingLineups[currentRound]) {
        startingLineups[currentRound] = {};
    }
    return startingLineups[currentRound];
}

// Get lineup for a specific fantasy player in current round
function getTeamLineup(fantasyPlayerId) {
    const roundLineups = getRoundLineups();
    if (!roundLineups[fantasyPlayerId]) {
        roundLineups[fantasyPlayerId] = {};
    }
    return roundLineups[fantasyPlayerId];
}

// Calculate fantasy points for an NFL player in current round
function calculatePlayerScore(playerName) {
    const stats = getRoundStats()[playerName];
    if (!stats) return 0;

    let points = 0;

    // Passing
    points += (stats.passingYards || 0) * SCORING.passingYards;
    points += (stats.passingTD || 0) * SCORING.passingTD;
    points += (stats.interceptions || 0) * SCORING.interception;

    // Rushing
    points += (stats.rushingYards || 0) * SCORING.rushingYards;
    points += (stats.rushingTD || 0) * SCORING.rushingTD;

    // Receiving (0.5 PPR)
    points += (stats.receptions || 0) * SCORING.reception;
    points += (stats.receivingYards || 0) * SCORING.receivingYards;
    points += (stats.receivingTD || 0) * SCORING.receivingTD;

    // Kicking
    points += (stats.fgMade0_39 || 0) * SCORING.fgMade0_39;
    points += (stats.fgMade40_49 || 0) * SCORING.fgMade40_49;
    points += (stats.fgMade50Plus || 0) * SCORING.fgMade50Plus;
    points += (stats.xpMade || 0) * SCORING.xpMade;
    points += (stats.fgMissed || 0) * SCORING.fgMissed;
    points += (stats.xpMissed || 0) * SCORING.xpMissed;

    // Defense
    points += (stats.sacks || 0) * SCORING.sack;
    points += (stats.defInterceptions || 0) * SCORING.defInterception;
    points += (stats.fumbleRecoveries || 0) * SCORING.fumbleRecovery;
    points += (stats.defensiveTD || 0) * SCORING.defensiveTD;
    points += (stats.safeties || 0) * SCORING.safety;
    points += (stats.blockedKicks || 0) * SCORING.blockedKick;

    // Misc
    points += (stats.fumblesLost || 0) * SCORING.fumbleLost;
    points += (stats.twoPointConversions || 0) * SCORING.twoPointConversion;

    return Math.round(points * 100) / 100;
}

// Calculate total score for a fantasy player (only started players count)
function calculateTeamScore(fantasyPlayerId) {
    const lineup = getTeamLineup(fantasyPlayerId);
    const slots = PLAYOFF_ROUNDS[currentRound].slots;
    let total = 0;

    slots.forEach(slot => {
        const playerName = lineup[slot.id];
        if (playerName) {
            total += calculatePlayerScore(playerName);
        }
    });

    return total;
}

// Get sorted standings for current round
function getStandings() {
    return FANTASY_PLAYERS.map(player => ({
        ...player,
        score: calculateTeamScore(player.id)
    })).sort((a, b) => b.score - a.score);
}

// Calculate score for a specific round
function calculateTeamScoreForRound(fantasyPlayerId, round) {
    const roundLineups = startingLineups[round] || {};
    const lineup = roundLineups[fantasyPlayerId] || {};
    const slots = PLAYOFF_ROUNDS[round].slots;
    const roundStats = playerStats[round] || {};
    let total = 0;

    slots.forEach(slot => {
        const playerName = lineup[slot.id];
        if (playerName && roundStats[playerName]) {
            const stats = roundStats[playerName];
            let points = 0;

            // Calculate points for this player
            points += (stats.passingYards || 0) * SCORING.passingYards;
            points += (stats.passingTD || 0) * SCORING.passingTD;
            points += (stats.interceptions || 0) * SCORING.interception;
            points += (stats.rushingYards || 0) * SCORING.rushingYards;
            points += (stats.rushingTD || 0) * SCORING.rushingTD;
            points += (stats.receptions || 0) * SCORING.reception;
            points += (stats.receivingYards || 0) * SCORING.receivingYards;
            points += (stats.receivingTD || 0) * SCORING.receivingTD;
            points += (stats.fumblesLost || 0) * SCORING.fumbleLost;

            total += points;
        }
    });

    return Math.round(total * 100) / 100;
}

// Calculate total score across all rounds
function calculateOverallTeamScore(fantasyPlayerId) {
    let total = 0;
    for (const round of Object.keys(PLAYOFF_ROUNDS)) {
        total += calculateTeamScoreForRound(fantasyPlayerId, round);
    }
    return total;
}

// Get overall standings across all rounds
function getOverallStandings() {
    return FANTASY_PLAYERS.map(player => {
        const roundScores = {};
        let totalScore = 0;

        for (const round of Object.keys(PLAYOFF_ROUNDS)) {
            const score = calculateTeamScoreForRound(player.id, round);
            roundScores[round] = score;
            totalScore += score;
        }

        return {
            ...player,
            score: totalScore,
            roundScores
        };
    }).sort((a, b) => b.score - a.score);
}

// Render standings for current round
function renderStandings() {
    const standings = getStandings();

    standingsContainer.innerHTML = standings.map((player, index) => {
        const lineup = getTeamLineup(player.id);
        const startedCount = Object.values(lineup).filter(p => p).length;
        const totalSlots = PLAYOFF_ROUNDS[currentRound].slots.length;

        return `
            <div class="standing-card rank-${index + 1}">
                <div class="rank">${index + 1}</div>
                <div class="team-info">
                    <div class="team-name">${player.name}</div>
                    <div class="team-record">${startedCount}/${totalSlots} starters set</div>
                </div>
                <div class="team-score">${player.score.toFixed(1)}</div>
            </div>
        `;
    }).join('');
}

// Render overall standings across all rounds
function renderOverallStandings() {
    const standings = getOverallStandings();

    overallStandingsContainer.innerHTML = standings.map((player, index) => {
        // Build round-by-round breakdown
        const roundBreakdown = Object.keys(PLAYOFF_ROUNDS)
            .map(round => `${PLAYOFF_ROUNDS[round].name.substring(0, 3)}: ${player.roundScores[round].toFixed(1)}`)
            .join(' | ');

        return `
            <div class="standing-card rank-${index + 1}">
                <div class="rank">${index + 1}</div>
                <div class="team-info">
                    <div class="team-name">${player.name}</div>
                    <div class="team-record">${roundBreakdown}</div>
                </div>
                <div class="team-score">${player.score.toFixed(1)}</div>
            </div>
        `;
    }).join('');
}

// Calculate total fantasy points for an NFL player across all rounds
function calculateNFLPlayerTotalScore(playerName) {
    let total = 0;
    for (const round of Object.keys(PLAYOFF_ROUNDS)) {
        const roundStats = playerStats[round] || {};
        const stats = roundStats[playerName];
        if (stats) {
            let points = 0;
            points += (stats.passingYards || 0) * SCORING.passingYards;
            points += (stats.passingTD || 0) * SCORING.passingTD;
            points += (stats.interceptions || 0) * SCORING.interception;
            points += (stats.rushingYards || 0) * SCORING.rushingYards;
            points += (stats.rushingTD || 0) * SCORING.rushingTD;
            points += (stats.receptions || 0) * SCORING.reception;
            points += (stats.receivingYards || 0) * SCORING.receivingYards;
            points += (stats.receivingTD || 0) * SCORING.receivingTD;
            points += (stats.fumblesLost || 0) * SCORING.fumbleLost;
            points += (stats.twoPointConversions || 0) * SCORING.twoPointConversion;
            total += points;
        }
    }
    return Math.round(total * 100) / 100;
}

// Get top NFL performers across all rounds
function getTopPerformers(limit = 10) {
    const allPlayers = getAllNFLPlayers();
    const performers = allPlayers.map(player => {
        const totalScore = calculateNFLPlayerTotalScore(player.name);
        // Get round-by-round scores
        const roundScores = {};
        for (const round of Object.keys(PLAYOFF_ROUNDS)) {
            const roundStats = playerStats[round] || {};
            const stats = roundStats[player.name];
            if (stats) {
                let points = 0;
                points += (stats.passingYards || 0) * SCORING.passingYards;
                points += (stats.passingTD || 0) * SCORING.passingTD;
                points += (stats.interceptions || 0) * SCORING.interception;
                points += (stats.rushingYards || 0) * SCORING.rushingYards;
                points += (stats.rushingTD || 0) * SCORING.rushingTD;
                points += (stats.receptions || 0) * SCORING.reception;
                points += (stats.receivingYards || 0) * SCORING.receivingYards;
                points += (stats.receivingTD || 0) * SCORING.receivingTD;
                points += (stats.fumblesLost || 0) * SCORING.fumbleLost;
                points += (stats.twoPointConversions || 0) * SCORING.twoPointConversion;
                roundScores[round] = Math.round(points * 100) / 100;
            } else {
                roundScores[round] = 0;
            }
        }
        return {
            ...player,
            totalScore,
            roundScores
        };
    });

    return performers
        .filter(p => p.totalScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, limit);
}

// Find which fantasy team owns a player
function findOwner(playerName) {
    for (const [teamId, roster] of Object.entries(DRAFT_PICKS)) {
        if (roster.find(p => p.name === playerName)) {
            const owner = FANTASY_PLAYERS.find(fp => fp.id === parseInt(teamId));
            return owner ? owner.name : 'Unknown';
        }
    }
    return 'Unknown';
}

// Render top performers section
function renderTopPerformers() {
    const topPerformers = getTopPerformers(10);

    topPerformersContainer.innerHTML = topPerformers.map((player, index) => {
        const owner = findOwner(player.name);
        const roundBreakdown = Object.keys(PLAYOFF_ROUNDS)
            .filter(round => player.roundScores[round] > 0)
            .map(round => `${PLAYOFF_ROUNDS[round].name.substring(0, 3)}: ${player.roundScores[round].toFixed(1)}`)
            .join(' | ');

        return `
            <div class="performer-card rank-${index + 1}">
                <div class="performer-rank">${index + 1}</div>
                <span class="player-position ${player.position.toLowerCase()}">${player.position}</span>
                <div class="performer-info">
                    <div class="performer-name">${player.name}</div>
                    <div class="performer-details">${NFL_TEAMS[player.team]?.name || player.team} · Owner: ${owner}</div>
                    <div class="performer-breakdown">${roundBreakdown}</div>
                </div>
                <div class="performer-score">${player.totalScore.toFixed(1)}</div>
            </div>
        `;
    }).join('');
}

// Render lineups section
function renderLineups() {
    const slots = PLAYOFF_ROUNDS[currentRound].slots;

    lineupsContainer.innerHTML = FANTASY_PLAYERS.map(fantasyPlayer => {
        const lineup = getTeamLineup(fantasyPlayer.id);
        const totalScore = calculateTeamScore(fantasyPlayer.id);
        const roster = DRAFT_PICKS[fantasyPlayer.id];

        return `
            <div class="lineup-card">
                <div class="lineup-header">
                    <h3>${fantasyPlayer.name}</h3>
                    <div class="lineup-total">${totalScore.toFixed(1)} pts</div>
                </div>
                <div class="lineup-slots-display">
                    ${slots.map(slot => {
                        const playerName = lineup[slot.id];
                        const player = playerName ? roster.find(p => p.name === playerName) : null;
                        const score = playerName ? calculatePlayerScore(playerName) : 0;
                        const isFlexSlot = slot.label === 'FLEX';

                        if (player) {
                            const statsText = formatPlayerStats(player.name);
                            return `
                                <div class="lineup-slot">
                                    <span class="slot-label ${isFlexSlot ? 'flex' : ''}">${slot.label}</span>
                                    <div class="player-info">
                                        <div class="player-name">${player.name}</div>
                                        <div class="player-team">${NFL_TEAMS[player.team]?.name || player.team}</div>
                                        ${statsText ? `<div class="player-stats">${statsText}</div>` : ''}
                                    </div>
                                    <div class="player-score">${score.toFixed(1)}</div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="lineup-slot">
                                    <span class="slot-label ${isFlexSlot ? 'flex' : ''}">${slot.label}</span>
                                    <div class="slot-empty">Empty</div>
                                    <div class="player-score">0.0</div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
                <div class="lineup-actions">
                    ${isRoundLocked()
                        ? '<button class="btn btn-small" disabled style="opacity: 0.5; cursor: not-allowed;">Locked</button>'
                        : `<button class="btn btn-primary btn-small" onclick="openLineupModal(${fantasyPlayer.id})">Set Lineup</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Format player stats for display
function formatPlayerStats(playerName) {
    const stats = getRoundStats()[playerName];
    if (!stats) return '';

    const parts = [];

    // Passing
    if (stats.passingYards) {
        let passStr = `${stats.passingYards} pass yds`;
        if (stats.passingTD) passStr += `, ${stats.passingTD} TD`;
        if (stats.interceptions) passStr += `, ${stats.interceptions} INT`;
        parts.push(passStr);
    }

    // Rushing
    if (stats.rushingYards || stats.rushingTD) {
        let rushStr = '';
        if (stats.rushingYards) rushStr = `${stats.rushingYards} rush yds`;
        if (stats.rushingTD) rushStr += rushStr ? `, ${stats.rushingTD} rush TD` : `${stats.rushingTD} rush TD`;
        if (rushStr) parts.push(rushStr);
    }

    // Receiving
    if (stats.receptions || stats.receivingYards || stats.receivingTD) {
        let recStr = '';
        if (stats.receptions) recStr = `${stats.receptions} rec`;
        if (stats.receivingYards) recStr += recStr ? `, ${stats.receivingYards} rec yds` : `${stats.receivingYards} rec yds`;
        if (stats.receivingTD) recStr += recStr ? `, ${stats.receivingTD} rec TD` : `${stats.receivingTD} rec TD`;
        if (recStr) parts.push(recStr);
    }

    // Fumbles
    if (stats.fumblesLost) {
        parts.push(`${stats.fumblesLost} fumble lost`);
    }

    // 2-Point Conversions
    if (stats.twoPointConversions) {
        parts.push(`${stats.twoPointConversions} 2PT`);
    }

    return parts.join(' | ');
}

// Check if NFL player's team is active in the current round
function isPlayerActiveInRound(teamCode) {
    const teamsInRound = TEAMS_BY_ROUND[currentRound] || [];
    return teamsInRound.includes(teamCode);
}

// Check if NFL player's team is on bye in the current round
function isPlayerOnBye(teamCode) {
    const byeTeams = BYE_TEAMS_BY_ROUND[currentRound] || [];
    return byeTeams.includes(teamCode);
}

// Check if NFL player's team is eliminated (not in current round and not on bye)
function isPlayerEliminated(teamCode) {
    return !isPlayerActiveInRound(teamCode) && !isPlayerOnBye(teamCode);
}

// Get player status text
function getPlayerStatus(teamCode) {
    if (isPlayerActiveInRound(teamCode)) return null;
    if (isPlayerOnBye(teamCode)) return "On Bye";
    return "Eliminated";
}

// Render rosters (bench view)
function renderRosters() {
    rostersContainer.innerHTML = FANTASY_PLAYERS.map(fantasyPlayer => {
        const roster = DRAFT_PICKS[fantasyPlayer.id];
        const lineup = getTeamLineup(fantasyPlayer.id);
        const startedPlayers = new Set(Object.values(lineup).filter(p => p));

        return `
            <div class="roster-card">
                <div class="roster-header">
                    <h3>${fantasyPlayer.name}</h3>
                    <div class="roster-total">Full Roster</div>
                </div>
                <div class="roster-players">
                    ${roster.map(player => {
                        const score = calculatePlayerScore(player.name);
                        const status = getPlayerStatus(player.team);
                        const isStarted = startedPlayers.has(player.name);
                        const isInactive = status !== null;
                        const isEliminated = status === "Eliminated";
                        const statsText = formatPlayerStats(player.name);
                        return `
                            <div class="roster-player ${isInactive ? 'player-inactive' : ''} ${isEliminated ? 'player-eliminated' : ''}" style="${isStarted ? 'opacity: 0.5;' : ''}">
                                <span class="player-position ${player.position.toLowerCase()}">${player.position}</span>
                                <div class="player-info">
                                    <div class="player-name">${player.name}${isStarted ? ' (Starting)' : ''}${status ? ` (${status})` : ''}</div>
                                    <div class="player-team">${NFL_TEAMS[player.team]?.name || player.team}</div>
                                    ${statsText ? `<div class="player-stats">${statsText}</div>` : ''}
                                </div>
                                <div class="player-score">${score.toFixed(1)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Get all unique NFL players from all rosters
function getAllNFLPlayers() {
    const players = [];
    Object.values(DRAFT_PICKS).forEach(roster => {
        roster.forEach(player => {
            if (!players.find(p => p.name === player.name)) {
                players.push(player);
            }
        });
    });
    return players.sort((a, b) => a.name.localeCompare(b.name));
}

// Populate NFL player dropdown
function populatePlayerSelect() {
    const players = getAllNFLPlayers();
    nflPlayerSelect.innerHTML = '<option value="">-- Select Player --</option>' +
        players.map(player => `
            <option value="${player.name}" data-position="${player.position}">
                ${player.name} (${player.position} - ${player.team})
            </option>
        `).join('');
}

// Get stat fields based on position
function getStatFields(position) {
    const commonFields = [
        { key: 'rushingYards', label: 'Rushing Yards' },
        { key: 'rushingTD', label: 'Rushing TDs' },
        { key: 'fumblesLost', label: 'Fumbles Lost' },
        { key: 'twoPointConversions', label: '2PT Conversions' }
    ];

    switch (position) {
        case 'QB':
            return [
                { key: 'passingYards', label: 'Passing Yards' },
                { key: 'passingTD', label: 'Passing TDs' },
                { key: 'interceptions', label: 'Interceptions' },
                ...commonFields
            ];
        case 'RB':
            return [
                { key: 'rushingYards', label: 'Rushing Yards' },
                { key: 'rushingTD', label: 'Rushing TDs' },
                { key: 'receptions', label: 'Receptions' },
                { key: 'receivingYards', label: 'Receiving Yards' },
                { key: 'receivingTD', label: 'Receiving TDs' },
                { key: 'fumblesLost', label: 'Fumbles Lost' },
                { key: 'twoPointConversions', label: '2PT Conversions' }
            ];
        case 'WR':
        case 'TE':
            return [
                { key: 'receptions', label: 'Receptions' },
                { key: 'receivingYards', label: 'Receiving Yards' },
                { key: 'receivingTD', label: 'Receiving TDs' },
                { key: 'rushingYards', label: 'Rushing Yards' },
                { key: 'rushingTD', label: 'Rushing TDs' },
                { key: 'fumblesLost', label: 'Fumbles Lost' },
                { key: 'twoPointConversions', label: '2PT Conversions' }
            ];
        case 'K':
            return [
                { key: 'fgMade0_39', label: 'FG Made (0-39 yds)' },
                { key: 'fgMade40_49', label: 'FG Made (40-49 yds)' },
                { key: 'fgMade50Plus', label: 'FG Made (50+ yds)' },
                { key: 'fgMissed', label: 'FG Missed' },
                { key: 'xpMade', label: 'XP Made' },
                { key: 'xpMissed', label: 'XP Missed' }
            ];
        case 'DEF':
            return [
                { key: 'sacks', label: 'Sacks' },
                { key: 'defInterceptions', label: 'Interceptions' },
                { key: 'fumbleRecoveries', label: 'Fumble Recoveries' },
                { key: 'defensiveTD', label: 'Defensive TDs' },
                { key: 'safeties', label: 'Safeties' },
                { key: 'blockedKicks', label: 'Blocked Kicks' }
            ];
        default:
            return commonFields;
    }
}

// Render stat input fields
function renderStatFields(playerName, position) {
    const fields = getStatFields(position);
    const currentStats = getRoundStats()[playerName] || {};

    statsForm.innerHTML = fields.map(field => `
        <div class="stat-input">
            <label for="stat-${field.key}">${field.label}</label>
            <input type="number"
                   id="stat-${field.key}"
                   data-stat="${field.key}"
                   value="${currentStats[field.key] || 0}"
                   min="0"
                   step="1">
        </div>
    `).join('');
}

// Save stats from form
function savePlayerStats() {
    const playerName = nflPlayerSelect.value;
    if (!playerName) return;

    const inputs = statsForm.querySelectorAll('input[data-stat]');
    const stats = {};

    inputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (value !== 0) {
            stats[input.dataset.stat] = value;
        }
    });

    getRoundStats()[playerName] = stats;
    saveStats();
    renderAll();
    closeModal();
}

// Check if current round is locked
function isRoundLocked(round = currentRound) {
    return LOCKED_ROUNDS.includes(round);
}

// Open lineup modal
function openLineupModal(fantasyPlayerId) {
    if (isRoundLocked()) {
        alert(`Lineups for ${PLAYOFF_ROUNDS[currentRound].name} are locked. This round has already been played.`);
        return;
    }
    currentEditingTeamId = fantasyPlayerId;
    const fantasyPlayer = FANTASY_PLAYERS.find(p => p.id === fantasyPlayerId);
    const roster = DRAFT_PICKS[fantasyPlayerId];
    const lineup = getTeamLineup(fantasyPlayerId);
    const slots = PLAYOFF_ROUNDS[currentRound].slots;

    lineupModalTeam.textContent = fantasyPlayer.name;

    lineupSlots.innerHTML = slots.map(slot => {
        // Only show players whose teams are active in this round AND match the position
        const eligiblePlayers = roster.filter(p =>
            slot.positions.includes(p.position) && isPlayerActiveInRound(p.team)
        );
        const currentSelection = lineup[slot.id] || '';

        return `
            <div class="lineup-slot-select">
                <label>${slot.label} ${slot.positions.length > 1 ? '(' + slot.positions.join('/') + ')' : ''}</label>
                <select data-slot="${slot.id}">
                    <option value="">-- Empty --</option>
                    ${eligiblePlayers.map(player => `
                        <option value="${player.name}" ${player.name === currentSelection ? 'selected' : ''}>
                            ${player.name} (${player.position} - ${player.team})
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }).join('');

    lineupModal.classList.add('active');
}

// Save lineup
function saveLineup() {
    if (!currentEditingTeamId) return;

    const lineup = getTeamLineup(currentEditingTeamId);
    const selects = lineupSlots.querySelectorAll('select[data-slot]');

    // Check for duplicate players
    const selectedPlayers = [];
    selects.forEach(select => {
        if (select.value) {
            selectedPlayers.push(select.value);
        }
    });

    const uniquePlayers = new Set(selectedPlayers);
    if (uniquePlayers.size !== selectedPlayers.length) {
        alert('Cannot start the same player in multiple slots!');
        return;
    }

    selects.forEach(select => {
        lineup[select.dataset.slot] = select.value || null;
    });

    saveLineups();
    renderAll();
    closeLineupModal();
}

// Close lineup modal
function closeLineupModal() {
    lineupModal.classList.remove('active');
    currentEditingTeamId = null;
}

// Modal controls
function openModal() {
    modal.classList.add('active');
    populatePlayerSelect();
    statsForm.innerHTML = '<p style="color: var(--text-secondary);">Select a player to enter stats.</p>';
}

function closeModal() {
    modal.classList.remove('active');
    nflPlayerSelect.value = '';
    statsForm.innerHTML = '';
}

// Render everything
function renderAll() {
    renderOverallStandings();
    renderTopPerformers();
    renderStandings();
    renderLineups();
    renderRosters();
}

// Event Listeners
document.getElementById('openScoreModal').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
document.getElementById('saveStats').addEventListener('click', savePlayerStats);

document.getElementById('closeLineupModal').addEventListener('click', closeLineupModal);
document.getElementById('cancelLineupModal').addEventListener('click', closeLineupModal);
document.getElementById('saveLineup').addEventListener('click', saveLineup);


nflPlayerSelect.addEventListener('change', (e) => {
    const playerName = e.target.value;
    if (playerName) {
        const option = e.target.options[e.target.selectedIndex];
        const position = option.dataset.position;
        renderStatFields(playerName, position);
    } else {
        statsForm.innerHTML = '<p style="color: var(--text-secondary);">Select a player to enter stats.</p>';
    }
});

// Close modals on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

lineupModal.addEventListener('click', (e) => {
    if (e.target === lineupModal) closeLineupModal();
});

// Keyboard shortcut to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.classList.contains('active')) closeModal();
        if (lineupModal.classList.contains('active')) closeLineupModal();
    }
});

// Initialize
initRoundTabs();
renderAll();

// Export functions for console debugging
window.fantasyTracker = {
    getStandings,
    getOverallStandings,
    calculatePlayerScore,
    calculateTeamScore,
    calculateTeamScoreForRound,
    calculateOverallTeamScore,
    playerStats,
    startingLineups,
    DRAFT_PICKS,
    FANTASY_PLAYERS,
    PLAYOFF_ROUNDS,
    currentRound,
    switchRound
};

console.log('Fantasy Playoff Tracker loaded!');
console.log('Access data via window.fantasyTracker');
