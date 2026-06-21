import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/apiClient';

export const placeOrder = createAsyncThunk('orders/placeOrder', async ({ shippingAddress }, thunkApi) => {
  try {
    const { data } = await api.post('/api/orders', { shippingAddress });
    return data.order;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/api/orders/mine');
    return data.orders;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to load orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/api/orders');
    return data.orders;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to load orders');
  }
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, thunkApi) => {
    try {
      const { data } = await api.put(`/api/orders/${id}/status`, { status });
      return data.order;
    } catch (e) {
      return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to update order');
    }
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    placing: 'idle',
    placeError: null,
    lastOrder: null,
    mine: [],
    mineStatus: 'idle',
    adminAll: [],
    adminStatus: 'idle',
  },
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null;
      state.placeError = null;
      state.placing = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placing = 'loading';
        state.placeError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placing = 'failed';
        state.placeError = action.payload || 'Failed to place order';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.mine = action.payload;
        state.mineStatus = 'succeeded';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminAll = action.payload;
        state.adminStatus = 'succeeded';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.adminAll = state.adminAll.map((o) => (o._id === updated._id ? updated : o));
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

