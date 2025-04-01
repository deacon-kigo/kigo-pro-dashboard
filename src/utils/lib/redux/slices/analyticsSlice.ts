import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface CallVolumeDataPoint {
  date: string;
  calls: number;
  tokenIssues: number;
  couponIssues: number;
  accountIssues: number;
  otherIssues: number;
  isAnomaly: boolean;
  anomalyReason: string | null;
}

export interface IssueMetric {
  name: string;
  count: number;
  percentOfTotal: number;
}

interface AnalyticsState {
  callVolumeData: CallVolumeDataPoint[];
  isLoading: boolean;
  error: string | null;
  currentCallVolume: number;
  averageCallVolume: number;
  issueMetrics: IssueMetric[];
  lastUpdated: string | null;
}

const initialState: AnalyticsState = {
  callVolumeData: [],
  isLoading: false,
  error: null,
  currentCallVolume: 0,
  averageCallVolume: 0,
  issueMetrics: [],
  lastUpdated: null
};

// Helper function to generate mock data (in real app, this would be API data)
const generateMockCallData = (): CallVolumeDataPoint[] => {
  const now = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Normal call volume
    let calls = Math.floor(Math.random() * 30) + 70;
    
    // Create a spike for day 2 (token system issue)
    if (i === 2) {
      calls = Math.floor(Math.random() * 80) + 150;
    }
    
    // Create another smaller spike for day 5 (coupon issue)
    if (i === 5) {
      calls = Math.floor(Math.random() * 40) + 110;
    }
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls,
      tokenIssues: Math.floor(calls * 0.4),
      couponIssues: Math.floor(calls * 0.3),
      accountIssues: Math.floor(calls * 0.2),
      otherIssues: Math.floor(calls * 0.1),
      isAnomaly: i === 2 || i === 5,
      anomalyReason: i === 2 ? 'Token Server Outage' : i === 5 ? 'Coupon Processing Delay' : null
    });
  }
  
  return data;
};

// Generate metrics from call data
const generateIssueMetrics = (callData: CallVolumeDataPoint[]): IssueMetric[] => {
  if (!callData.length) return [];
  
  // Get today's data
  const todayData = callData[callData.length - 1];
  const total = todayData.calls;
  
  return [
    { 
      name: 'Token Issues', 
      count: todayData.tokenIssues, 
      percentOfTotal: Math.round((todayData.tokenIssues / total) * 100) 
    },
    { 
      name: 'Coupon Issues', 
      count: todayData.couponIssues, 
      percentOfTotal: Math.round((todayData.couponIssues / total) * 100) 
    },
    { 
      name: 'Account Issues', 
      count: todayData.accountIssues, 
      percentOfTotal: Math.round((todayData.accountIssues / total) * 100) 
    }
  ];
};

// Async thunk to fetch call volume data
export const fetchCallVolumeData = createAsyncThunk(
  'analytics/fetchCallVolumeData',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll use our mock data generation
      const data = generateMockCallData();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch call volume data');
    }
  }
);

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    refreshAnalyticsData: (state) => {
      // In a real app, this would trigger the fetch thunk
      // For demo, we'll directly update with new data
      const data = generateMockCallData();
      state.callVolumeData = data;
      state.currentCallVolume = data[data.length - 1].calls;
      state.averageCallVolume = Math.round(
        data.reduce((sum, point) => sum + point.calls, 0) / data.length
      );
      state.issueMetrics = generateIssueMetrics(data);
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallVolumeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCallVolumeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.callVolumeData = action.payload;
        state.currentCallVolume = action.payload[action.payload.length - 1].calls;
        state.averageCallVolume = Math.round(
          action.payload.reduce((sum, point) => sum + point.calls, 0) / action.payload.length
        );
        state.issueMetrics = generateIssueMetrics(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCallVolumeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { refreshAnalyticsData } = analyticsSlice.actions;

export default analyticsSlice.reducer; 