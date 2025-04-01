import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MockUser, getUserForContext } from '@/lib/userProfileUtils';

// Define notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface UserState {
  // User profile
  profile: MockUser | null;
  isAuthenticated: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  notifications: [
    {
      id: '1',
      title: 'Welcome to Kigo PRO',
      message: 'Thank you for using Kigo PRO. Explore all our features.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'New Feature Available',
      message: 'Try our new AI Campaign Creator for smarter marketing.',
      type: 'success',
      read: false,
      createdAt: new Date().toISOString()
    }
  ],
  unreadCount: 2,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<MockUser>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    
    updateUserProfile: (state, action: PayloadAction<Partial<MockUser>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    
    loadUserProfileFromContext: (state, action: PayloadAction<{ role: string; clientId: string }>) => {
      const { role, clientId } = action.payload;
      const userProfile = getUserForContext(role, clientId);
      
      if (userProfile) {
        state.profile = userProfile;
        state.isAuthenticated = true;
      }
    },
    
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      
      if (index !== -1) {
        const wasUnread = !state.notifications[index].read;
        state.notifications.splice(index, 1);
        
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  }
});

export const {
  setUserProfile,
  updateUserProfile,
  loadUserProfileFromContext,
  logout,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications
} = userSlice.actions;

export default userSlice.reducer; 