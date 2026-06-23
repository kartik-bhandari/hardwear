import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/apiClient';

const initialState = {
  user: JSON.parse(localStorage.getItem('hw_user') || 'null'),
  token: localStorage.getItem('hw_token') || null,
  status: 'idle',
  error: null,
  users: [],
  usersStatus: 'idle',
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkApi) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      return data;
    } catch (e) {
      return thunkApi.rejectWithValue(e?.response?.data?.message || 'Register failed');
    }
  },
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, thunkApi) => {
    try {
      const { data } = await api.post('/api/auth/verify-otp', { email, otp });
      return data;
    } catch (e) {
      return thunkApi.rejectWithValue(e?.response?.data?.message || 'Verification failed');
    }
  },
);


export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates, thunkApi) => {
    try {
      const { data } = await api.put('/api/auth/profile', updates);
      return data;
    } catch (e) {
      return thunkApi.rejectWithValue(e?.response?.data?.message || 'Profile update failed');
    }
  },
);

export const googleLogin = createAsyncThunk('auth/googleLogin', async (credential, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/google', { credential });
    return data;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Google authentication failed');
  }
});

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/api/auth/users');
    return data.users;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to load users');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('hw_user');
      localStorage.removeItem('hw_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('hw_user', JSON.stringify(action.payload.user));
        localStorage.setItem('hw_token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Register failed';
      })
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('hw_user', JSON.stringify(action.payload.user));
        localStorage.setItem('hw_token', action.payload.token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Verification failed';
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('hw_user', JSON.stringify(action.payload.user));
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('hw_token', action.payload.token);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Profile update failed';
      })
      .addCase(googleLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('hw_user', JSON.stringify(action.payload.user));
        localStorage.setItem('hw_token', action.payload.token);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Google authentication failed';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersStatus = 'failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

