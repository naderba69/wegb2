// User Interaction Enhancements for Wegb2 German Course
// Works entirely on client-side, offline, using localStorage

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);

// App state stored in localStorage
function getAppState() {
  const stored = localStorage.getItem('wegb2-app-state');
  return stored ? JSON.parse(stored) : getDefaultState();
}

function saveAppState(state) {
  localStorage.setItem('wegb2-app-state', JSON.stringify(state));
  // Also update the JSON file for backup
  fetch('/update-local-storage', {
    method: 'POST',
    body: JSON.stringify(state)
  });
}

// Default state
function getDefaultState() {
  return {
    userId: 'anonymous-' + Date.now(),
    currentLevel: 'A1',
    completedExercises: [],
    stats: {
      totalExercises: 0,
      correctAnswers: 0,
      streakDays: 0,
      lastActivity: null
    },
    preferences: {
      autoPlayAudio: true,
      showTranscript: true,
      difficulty: 'medium',
      languageFocus: 'both' // 'german', 'arabic', 'both'
    },
    sessionStats: {
      exercisesToday: 0,
      startDate: new Date().toISOString(),
      lastSession: new Date().toISOString()
    }
  }
}

// Initialize app state
let appState = getAppState();

// ============================================
// Exercise Randomizer - NEW FEATURE
// ============================================

/**
 * Get a random exercise from the exercises list
 * @param {string} level - Current level (A1, A2, B1, B2)
 * @returns {object} Random exercise object or null
 */
function getRandomExercise(level = appState.currentLevel) {
  // Filter exercises by level from the global exercises list
  // This would be populated when the page loads the exercises data
  const allExercises = window.exercisesData || [];
  const levelExercises = allExercises.filter(ex => ex.level === level);
  
  if (levelExercises.length === 0) return null;
  
  // Get random exercise
  const randomIndex = Math.floor(Math.random() * levelExercises.length);
  return levelExercises[randomIndex];
}

// ============================================
// Exercise Tracking
// ============================================

/**
 * Mark an exercise as completed
 * @param {string} exerciseId - The exercise ID
 * @param {boolean} correct - Whether answered correctly
 */
function markExerciseCompleted(exerciseId, correct = true) {
  // Add to completed list if not already there
  if (!appState.completedExercises.includes(exerciseId)) {
    appState.completedExercises.push(exerciseId);
  }
  
  // Update stats
  appState.stats.totalExercises++;
  if (correct) {
    appState.stats.correctAnswers++;
  }
  
  // Update streak
  const now = new Date();
  const lastActivity = appState.stats.lastActivity;
  
  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      // Consecutive day
      appState.stats.streakDays = Math.min(appState.stats.streakDays + 1, 365);
    } else if (diffDays > 1) {
      // Streak broken
      appState.stats.streakDays = 1;
    }
  } else {
    // First exercise
    appState.stats.streakDays = 1;
  }
  
  // Update last activity
  appState.stats.lastActivity = now.toISOString();
  appState.sessionStats.exercisesToday++;
  appState.sessionStats.lastSession = now.toISOString();
  
  // Save state
  saveAppState(appState);
  
  
// ============================================
// Points and Achievements System
// ============================================

/**
 * Award points for exercise completion
 * @param {number} points - Points to award
 */
function awardPoints(points) {
  if (!appState.points) appState.points = { total_points: 0, points_today: 0 };
  
  appState.points.total_points += points;
  appState.points.points_today += points;
  
  // Update global stats
  if (appState.stats) {
    appState.stats.total_exercises++;
  }
  
  // Save state
  saveAppState(appState);
  
  // Check for achievements
  checkAchievements(points);
  
  // Update display
  updatePointsDisplay();
  return appState.points.total_points;
}

/**
 * Check and award achievements
 * @param {number} points - Points just earned
 */
function checkAchievements(points) {
  if (!appState.achievements || !appState.achievements.definitions) return;
  
  const definitions = appState.achievements.definitions;
  const progress = appState.achievements.user_progress;
  
  // Update exercise count
  progress.exercises_completed++;
  
  // Update total points
  progress.total_earned_points = appState.points.total_points;
  
  // Check milestone badges
  const streak = appState.stats ? appState.stats.streakDays : 0;
  
  // 7-day streak
  if (streak >= 7 && !progress.badges_earned.includes('streak_7')) {
    progress.badges_earned.push('streak_7');
    console.log('Achievement unlocked: streak_7 - Week Streak');
  }
  
  // Check 30-day streak
  if (streak >= 30 && !progress.badges_earned.includes('streak_30')) {
    progress.badges_earned.push('streak_30');
    console.log('Achievement unlocked: streak_30 - Month Streak');
  }
  
  // Exercise milestones
  if (!progress.badges_earned.includes('exercise_10') && progress.exercises_completed >= 10) {
    progress.badges_earned.push('exercise_10');
    console.log('Achievement unlocked: exercise_10 - Dedicated');
  }
  if (!progress.badges_earned.includes('exercise_50') && progress.exercises_completed >= 50) {
    progress.badges_earned.push('exercise_50');
    console.log('Achievement unlocked: exercise_50 - Serious Learner');
  }
  if (!progress.badges_earned.includes('exercise_100') && progress.exercises_completed >= 100) {
    progress.badges_earned.push('exercise_100');
    console.log('Achievement unlocked: exercise_100 - Master');
  }
  
  // Update progress
  progress.accuracy_current = appState.stats ? (appState.stats.correctAnswers / appState.stats.total_exercises * 100 || 0).toFixed(1) : 0;
  
  // Save updated state
  saveAppState(appState);
  return progress;
}

/**
 * Update points display in UI
 */
function updatePointsDisplay() {
  const points = appState.points || { total_points: 0, points_today: 0 };
  const badges = appState.achievements && appState.achievements.user_progress && appState.achievements.user_progress.badges_earned || [];
  
  const displayElements = document.querySelectorAll('.points-counter, .badges-count, .achievements-list');
  
  if (displayElements.length > 0) {
    if (document.querySelector('.total-points')) {
      document.querySelector('.total-points').textContent = `${points.total_points} points`;
    }
    if (document.querySelector('.points-today')) {
      document.querySelector('.points-today').textContent = `+${points.points_today} today`;
    }
    if (document.querySelector('.badges-count')) {
      document.querySelector('.badges-count').textContent = `+${badges.length} badges`;
    }
  }
}

// Make points functions available globally
window.wegb2.awardPoints = awardPoints;
window.wegb2.checkAchievements = checkAchievements;
window.wegb2.updatePointsDisplay = updatePointsDisplay;
// Update UI
  updateStatsDisplay();
  
  return appState;
}

// ============================================
// Preferences Management
// ============================================

/**
 * Update user preferences
 * @param {object} prefs - New preferences
 */
function updatePreferences(prefs) {
  appState.preferences = {
    ...appState.preferences,
    ...prefs
  };
  saveAppState(appState);
  applyPreferences();
}

// Apply preferences to UI
function applyPreferences() {
  const prefs = appState.preferences;
  // Apply audio auto-play
  if (window.audioPlayer) {
    window.audioPlayer.autoPlay = prefs.autoPlayAudio;
  }
  // Apply transcript visibility
  const transcriptElements = document.querySelectorAll('.transcript, .arabic, .german');
  transcriptElements.forEach(el => {
    el.style.display = prefs.showTranscript ? 'block' : 'none';
  });
}

// ============================================
// Session Statistics
// ============================================

/**
 * Get current session stats
 * @returns {object} Session statistics
 */
function getSessionStats() {
  return {
    ...appState.sessionStats,
    exercisesToday: appState.sessionStats.exercisesToday + 1, // Increment for current
    lastActivity: new Date().toISOString()
  };
}

// ============================================
// UI Update Helper
// ============================================

/**
 * Update the stats display in the UI
 */
function updateStatsDisplay() {
  const stats = appState.stats;
  const displayElements = document.querySelectorAll('.stats-counter, .exercise-count, .progress-bar');
  
  displayElements.forEach(el => {
    if (el.dataset.type === 'total') {
      el.textContent = `${appState.stats.totalExercises} تم`;
    } else if (el.dataset.type === 'correct') {
      el.textContent = `${appState.stats.correctAnswers} صحيح`;
    } else if (el.dataset.type === 'streak') {
      el.textContent = ` streak: ${appState.stats.streakDays} يوم`;
    }
  });
}

// Export functionality for the user
function exportStats() {
  const data = {
    appState,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wegb2-stats-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Make functions available globally
window.wegb2 = {
  getAppState,
  saveAppState,
  getRandomExercise,
  markExerciseCompleted,
  updatePreferences,
  // Automatic user identification from first contact (no login/logout)
  // User ID is generated on first use and persists automatically
  getUserId: function() {
    return appState.userId;
  },
  // Update preferences
  updatePreferences: function(prefs) {
    appState.preferences = {
      ...appState.preferences,
      ...prefs
    };
    saveAppState(appState);
    applyPreferences();
    return true;
  },
  // Session statistics
  getSessionStats: function() {
    return {
      ...appState.sessionStats,
      exercisesToday: appState.sessionStats.exercisesToday + 1,
      lastActivity: new Date().toISOString()
    };
  },
  // Export
  exportStats: function() {
    const data = {
      appState,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wegb2-stats-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }
};

// Initialize on load
initApp();

// Initialize function
function initApp() {
  // Automatic user identification from first contact (no login/logout)
  // User ID is generated on first use and persists automatically across sessions
  let savedUserId = localStorage.getItem('wegb2-user-id');
  
  // First time user - generate automatic ID that persists
  if (!savedUserId) {
    savedUserId = 'user-' + Date.now();
    localStorage.setItem('wegb2-user-id', savedUserId);
    localStorage.setItem('wegb2-first-contact', new Date().toISOString());
    console.log('First contact recorded - User ID:', savedUserId);
  }
  
  // Set the user ID in app state
  if (appState.userId.startsWith('anonymous') || !appState.userId) {
    appState.userId = savedUserId;
  }
  
  // Apply saved preferences (from previous sessions)
  applyPreferences();
  
  // Display initial stats
  updateStatsDisplay();
  
  // Make exercises filterable by level if exercises data exists
  if (window.exercisesData) {
    console.log('Exercises loaded:', window.exercisesData.length, 'total');
    console.log('Levels:', [...new Set(window.exercisesData.map(e => e.level))]);
  }
  
  // Log initialization info
  if (typeof console !== 'undefined' && console.log) {
    const firstContact = localStorage.getItem('wegb2-first-contact');
    console.log('Wegb2 App Initialized - User ID:', savedUserId);
    console.log('Is Returning User:', !!firstContact);
  }
}



// ============================================
// Simplified AI Suggestions for Next Exercises
// ============================================

/**
 * Get suggested exercises based on performance and level
 * @param {string} currentLevel - Current level (A1, A2, B1, B2)
 * @param {number} previousCorrect - Recent correctness (1 for correct, 0 for incorrect)
 * @returns {array} Array of suggested exercise IDs
 */
function getSuggestedExercises(currentLevel = appState.currentLevel, previousCorrect = 1) {
  // Get exercises for current level from window.exercisesData
  const allExercises = window.exercisesData || [];
  const levelExercises = allExercises.filter(ex => ex.level === currentLevel);
  
  if (levelExercises.length === 0) return [];
  
  // Filter out already completed exercises
  const completed = appState.completedExercises || [];
  const availableExercises = levelExercises.filter(ex => !completed.includes(ex.id));
  
  if (availableExercises.length === 0) return [];
  
  // Simple AI logic: if user was correct, suggest exercises they haven't tried
  // if incorrect, suggest review exercises
  const suggestions = [];
  
  // Get unavailable (completed) ones for review suggestion
  const unavailable = levelExercises.filter(ex => completed.includes(ex.id));
  
  // Suggest up to 3 new exercises
  const suggestions = [];
  const sortedAvailable = availableExercises.sort((a, b) => 
    (a.difficulty || 'medium').localeCompare(b.difficulty || 'medium')
  );
  
  // Take up to 3 suggestions
  const limit = Math.min(3, sortedAvailable.length);
  for (let i = 0; i < limit; i++) {
    suggestions.push(sortedAvailable[i].id);
  }
  
  // Also suggest 1 review exercise if they got something wrong
  if (previousCorrect === 0 && unavailable.length > 0) {
    suggestions.unshift(unavailable[0].id);
  }
  
  return suggestions;
}

// Make function available globally
window.wegb2.getSuggestedExercises = getSuggestedExercises;


// Export comprehensive user report
function exportComprehensiveReport() {
  const report = {
    userId: appState.userId,
    totalExercises: appState.stats ? appState.stats.totalExercises : 0,
    correctAnswers: appState.stats ? appState.stats.correctAnswers : 0,
    accuracy: appState.stats ? (appState.stats.totalExercises > 0 ? (appState.stats.correctAnswers / appState.stats.totalExercises * 100).toFixed(1) : 0) : 0,
    streakDays: appState.stats ? appState.stats.streakDays : 0,
    totalPoints: appState.points ? appState.points.total_points : 0,
    badgesEarned: appState.achievements && appState.achievements.user_progress && appState.achievements.user_progress.badges_earned ? appState.achievements.user_progress.badges_earned : [],
    completedExercises: appState.completedExercises || [],
    levelProgression: {},
    recommendations: []
  };
  
  // Analyze level progression from exercises data
  if (window.exercisesData) {
    const levelData = {};
    window.exercisesData.forEach(ex => {
      const level = ex.level;
      if (!levelData[level]) levelData[level] = { completed: 0, total: 0 };
      levelData[level].total++;
      if (appState.completedExercises && appState.completedExercises.includes(ex.id)) {
        levelData[level].completed++;
      }
    }
    report.levelProgression = levelData;
  }
  
  // Generate recommendations based on performance
  if (report.accuracy && report.accuracy < 50) {
    report.recommendations = ['Review basic exercises', 'Focus on grammar drills', 'Practice listening more'];
  } else if (report.accuracy && report.accuracy < 80) {
    report.recommendations = ['Progress to next level', 'Try mixed-type exercises', 'Challenge yourself with B1 content'];
  } else {
    report.recommendations = ['Progress to B2 level', 'Try advanced grammar', 'Prepare for certification'];
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wegb2-comprehensive-report-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  return report;
}

// Make function available globally
window.wegb2.exportComprehensiveReport = exportComprehensiveReport;


/**
 * Get teacher course information
 * @returns {object} Teacher course information
 */
function getTeacherInfo() {
  // Try to get from localStorage
  const stored = localStorage.getItem('wegb2-teacher-info');
  if (stored) {
    return JSON.parse(stored);
  }
  // Return default
  return {
    teacherName: 'Wegb2 German Course',
    courseName: 'German A0-B2 Self-Study',
    totalHours: 80,
    lessonsCompleted: 0,
    courseCompleted: false
  };
}

/**
 * Get level progress for all levels
 * @returns {object} Level progress object
 */
function getLevelProgress() {
  const stored = localStorage.getItem('wegb2-level-progress');
  if (stored) {
    return JSON.parse(stored);
  }
  // Return default progress
  return {
    A0: { completed: 10, total: 10, progress: 100 },
    A1: { completed: 0, total: 23, progress: 0 },
    A2: { completed: 0, total: 14, progress: 0 },
    B1: { completed: 0, total: 14, progress: 0 },
    B2: { completed: 0, total: 14, progress: 0 }
  };
}

/**
 * Get weekly goals
 * @returns {object} Weekly goals
 */
function getWeeklyGoals() {
  const stored = localStorage.getItem('wegb2-weekly-goals');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    currentWeek: 1,
    goalsSet: ['Complete 5 exercises this week', 'Practice listening 10 minutes'],
    goalsCompleted: 0
  };
}

// Make functions available globally
window.wegb2.getTeacherInfo = getTeacherInfo;
window.wegb2.getLevelProgress = getLevelProgress;
window.wegb2.getWeeklyGoals = getWeeklyGoals;


// ============================================
// Advanced AI-Powered Exercise Suggestions
// ============================================

/**
 * Advanced AI analysis of user performance patterns
 * @param {string} currentLevel - Current proficiency level
 * @param {array} performanceHistory - Array of {correct: boolean, exerciseId: string, timestamp: string}
 * @returns {object} Personalized suggestions
 */
function getAdvancedSuggestions(currentLevel = appState.currentLevel, performanceHistory = []) {
  // Get all exercises for current level from window.exercisesData
  const allExercises = window.exercisesData || [];
  const levelExercises = allExercises.filter(ex => ex.level === currentLevel);
  
  if (levelExercises.length === 0) return [];
  
  // Analyze performance patterns
  const correctCount = performanceHistory.filter(h => h.correct).length;
  const totalCount = performanceHistory.length;
  const accuracy = totalCount > 0 ? (correctCount / totalCount * 100).toFixed(1) : 100;
  
  // Determine user's strength areas and weaknesses
  const strengths = [];
  const weaknesses = [];
  
  // Analyze exercise types performed
  const typePerformance = {};
  performanceHistory.forEach(perf => {
    const exercise = allExercises.find(ex => ex.id === perf.exerciseId);
    if (exercise) {
      const type = exercise.type;
      if (!typePerformance[type]) typePerformance[type] = { correct: 0, total: 0 };
      typePerformance[type].total++;
      if (perf.correct) typePerformance[type].correct++;
    }
  );
  
  // Determine strengths and weaknesses
  Object.keys(typePerformance).forEach(type => {
    const accuracy = typePerformance[type].total > 0 ? 
      (typePerformance[type].correct / typePerformance[type].total * 100).toFixed(1) : 0;
    if (accuracy >= 80) strengths.push(type);
    else if (accuracy < 60) weaknesses.push(type);
  });
  
  // Select exercises based on analysis
  const suggestions = [];
  const availableExercises = levelExercises.filter(ex => 
    !performanceHistory.some(perf => perf.exerciseId === ex.id)
  );
  
  // Prioritize: 1 weakness exercise, 2 strength exercises, rest new exercises
  const weaknessExercises = availableExercises.filter(ex => 
    typePerformance[ex.type] && typePerformance[ex.type].accuracy < 60
  );
  const strengthExercises = availableExercises.filter(ex => 
    typePerformance[ex.type] && typePerformance[ex.type].accuracy >= 80 && typePerformance[ex.type].total >= 3
  );
  const newExercises = availableExercises.filter(ex => 
    !typePerformance[ex.type] || typePerformance[ex.type].total < 3
  );
  
  // Add 1 weakness exercise if available
  if (weaknessExercises.length > 0) {
    suggestions.push(weaknessExercises[0].id);
  }
  
  // Add 2 strength exercises for confidence building
  const strengthLimit = Math.min(2, strengthExercises.length);
  for (let i = 0; i < strengthLimit; i++) {
    suggestions.push(strengthExercises[i].id);
  }
  
  // Fill remaining slots with new exercises
  const remainingSlots = 3 - suggestions.length;
  const newLimit = Math.min(remainingSlots, newExercises.length);
  for (let i = 0; i < newLimit; i++) {
    suggestions.push(newExercises[i].id);
  }
  
  return suggestions;
}

// Make function available globally
window.wegb2.getAdvancedSuggestions = getAdvancedSuggestions;

// Integrate with exercise completion
const originalMarkComplete = window.wegb2.markExerciseCompleted;
window.wegb2.markExerciseCompleted = function(exerciseId, correct = true) {
  // Call original functionality
  const result = originalMarkComplete(exerciseId, correct);
  
  // Add to performance history for AI analysis
  const timestamp = new Date().toISOString();
  if (!appState.performanceHistory) appState.performanceHistory = [];
  appState.performanceHistory.push({
    exerciseId: exerciseId,
    correct: correct,
    timestamp: timestamp
  });
  
  // Keep history manageable (max 50 entries)
  if (appState.performanceHistory.length > 50) {
    appState.performanceHistory = appState.performanceHistory.slice(-50);
  }
  
  // Save state
  saveAppState();
  
  // Provide suggestions for next exercise
  const suggestions = getAdvancedSuggestions();
  if (suggestions.length > 0) {
    console.log('Suggested next exercises:', suggestions);
    // Could display to user or store for later
  }
  
  return result;
}