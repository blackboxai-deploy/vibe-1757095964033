// Firebase Configuration and Utilities
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, set, get, push, update, remove, onValue, off } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj2CinoTCJg0fyX2yEZVpG8uHagWXSbW0",
  authDomain: "test2-125bd.firebaseapp.com",
  databaseURL: "https://test2-125bd-default-rtdb.firebaseio.com",
  projectId: "test2-125bd",
  storageBucket: "test2-125bd.firebasestorage.app",
  messagingSenderId: "764110769531",
  appId: "1:764110769531:web:aef985efd1a5d32d0301de",
  measurementId: "G-QPRYPPTWZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Connection status tracking
let isConnected = false;
const connectionCallbacks = [];

// Monitor connection status
const connectedRef = ref(database, '.info/connected');
onValue(connectedRef, (snapshot) => {
  isConnected = snapshot.val() === true;
  updateConnectionStatus();
  connectionCallbacks.forEach(callback => callback(isConnected));
});

function updateConnectionStatus() {
  const statusElements = document.querySelectorAll('.connection-status');
  statusElements.forEach(element => {
    if (isConnected) {
      element.textContent = 'Connected';
      element.className = 'connection-status connected';
    } else {
      element.textContent = 'Disconnected';
      element.className = 'connection-status disconnected';
    }
  });
}

function onConnectionChange(callback) {
  connectionCallbacks.push(callback);
}

// Database utility functions
const FirebaseDB = {
  // Web Series operations
  async saveWebSeries(seriesData) {
    try {
      const seriesRef = ref(database, `webseries/${seriesData.id || Date.now()}`);
      await set(seriesRef, {
        ...seriesData,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving web series:', error);
      throw error;
    }
  },

  async getWebSeries(seriesId = null) {
    try {
      const seriesRef = seriesId ? ref(database, `webseries/${seriesId}`) : ref(database, 'webseries');
      const snapshot = await get(seriesRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching web series:', error);
      throw error;
    }
  },

  async updateWebSeries(seriesId, updateData) {
    try {
      const seriesRef = ref(database, `webseries/${seriesId}`);
      await update(seriesRef, {
        ...updateData,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating web series:', error);
      throw error;
    }
  },

  async deleteWebSeries(seriesId) {
    try {
      const seriesRef = ref(database, `webseries/${seriesId}`);
      await remove(seriesRef);
      return true;
    } catch (error) {
      console.error('Error deleting web series:', error);
      throw error;
    }
  },

  // Movie operations
  async saveMovie(movieData) {
    try {
      const movieRef = ref(database, `movies/${movieData.id || Date.now()}`);
      await set(movieRef, {
        ...movieData,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving movie:', error);
      throw error;
    }
  },

  async getMovies(movieId = null) {
    try {
      const movieRef = movieId ? ref(database, `movies/${movieId}`) : ref(database, 'movies');
      const snapshot = await get(movieRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  async updateMovie(movieId, updateData) {
    try {
      const movieRef = ref(database, `movies/${movieId}`);
      await update(movieRef, {
        ...updateData,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  async deleteMovie(movieId) {
    try {
      const movieRef = ref(database, `movies/${movieId}`);
      await remove(movieRef);
      return true;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },

  // Comments operations
  async saveComment(contentId, contentType, comment) {
    try {
      const commentRef = push(ref(database, 'comments'));
      await set(commentRef, {
        contentId,
        contentType,
        comment,
        timestamp: Date.now(),
        date: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving comment:', error);
      throw error;
    }
  },

  async getComments(contentId = null) {
    try {
      const commentsRef = ref(database, 'comments');
      const snapshot = await get(commentsRef);
      if (!snapshot.exists()) return [];
      
      const comments = snapshot.val();
      const commentArray = Object.keys(comments).map(key => ({
        id: key,
        ...comments[key]
      }));

      if (contentId) {
        return commentArray.filter(comment => comment.contentId === contentId);
      }
      
      return commentArray.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Real-time listeners
  listenToWebSeries(callback) {
    const seriesRef = ref(database, 'webseries');
    onValue(seriesRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      callback(data);
    });
    return () => off(seriesRef);
  },

  listenToMovies(callback) {
    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      callback(data);
    });
    return () => off(moviesRef);
  },

  listenToComments(contentId, callback) {
    const commentsRef = ref(database, 'comments');
    onValue(commentsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const comments = snapshot.val();
      const commentArray = Object.keys(comments).map(key => ({
        id: key,
        ...comments[key]
      }));
      
      const filteredComments = contentId 
        ? commentArray.filter(comment => comment.contentId === contentId)
        : commentArray;
        
      callback(filteredComments.sort((a, b) => b.timestamp - a.timestamp));
    });
  }
};

// Utility functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#8B0000' : type === 'error' ? '#FF0000' : '#333'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Export for global use
window.FirebaseDB = FirebaseDB;
window.showNotification = showNotification;
window.onConnectionChange = onConnectionChange;