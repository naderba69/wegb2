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
  getSessionStats,
  exportStats
};

// Initialize on load
initApp();

// Initialize function
function initApp() {
  // Check for any stored state restoration
  const savedUserId = localStorage.getItem('wegb2-user-id');
  if (savedUserId && appState.userId.startsWith('anonymous')) {
    appState.userId = savedUserId;
  }
  
  // Set default user ID if not set
  if (!appState.userId) {
    appState.userId = 'anonymous-' + Date.now();
    localStorage.setItem('wegb2-user-id', appState.userId);
  }
  
  // Apply saved preferences
  applyPreferences();
  
  // Display initial stats
  updateStatsDisplay();
  
  // Make exercises filterable by level if exercises data exists
  if (window.exercisesData) {
    console.log('Exercises loaded:', window.exercisesData.length, 'total');
    console.log('Levels:', [...new Set(window.exercisesData.map(e => e.level))]);
  }
}

