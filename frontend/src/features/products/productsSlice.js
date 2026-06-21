import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/apiClient';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, thunkApi) => {
  try {
    const { data } = await api.get('/api/products', { params });
    return data.products;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to load products');
  }
});

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (slug, thunkApi) => {
  try {
    const { data } = await api.get(`/api/products/${slug}`);
    return data.product;
  } catch (e) {
    return thunkApi.rejectWithValue(e?.response?.data?.message || 'Failed to load product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    active: null,
    activeStatus: 'idle',
    activeError: null,
  },
  reducers: {
    clearActive(state) {
      state.active = null;
      state.activeStatus = 'idle';
      state.activeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load products';
      })
      .addCase(fetchProduct.pending, (state) => {
        state.activeStatus = 'loading';
        state.activeError = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.activeStatus = 'succeeded';
        state.active = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.activeStatus = 'failed';
        state.activeError = action.payload || 'Failed to load product';
      });
  },
});

export const { clearActive } = productsSlice.actions;
export default productsSlice.reducer;

