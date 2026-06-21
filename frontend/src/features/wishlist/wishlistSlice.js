import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/apiClient';

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem('hw_wishlist') || 'null');
  } catch {
    return null;
  }
}

function saveLocal(wishlist) {
  localStorage.setItem('hw_wishlist', JSON.stringify(wishlist));
}

function emptyWishlist() {
  return { items: [] };
}

function getAuthToken(getState) {
  return getState().auth.token;
}

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkApi) => {
  if (!getAuthToken(thunkApi.getState)) {
    return loadLocal() || emptyWishlist();
  }
  const { data } = await api.get('/api/wishlist');
  return data.wishlist;
});

export const addWishlistItem = createAsyncThunk('wishlist/addWishlistItem', async (payload, thunkApi) => {
  const token = getAuthToken(thunkApi.getState);
  if (!token) return { mode: 'local', payload };
  const { data } = await api.post('/api/wishlist/items', payload);
  return { mode: 'remote', wishlist: data.wishlist };
});

export const removeWishlistItem = createAsyncThunk(
  'wishlist/removeWishlistItem',
  async (payload, thunkApi) => {
    const token = getAuthToken(thunkApi.getState);
    if (!token) return { mode: 'local', payload };
    const { data } = await api.delete('/api/wishlist/items', { data: payload });
    return { mode: 'remote', wishlist: data.wishlist };
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: loadLocal() || emptyWishlist(),
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload || emptyWishlist();
        saveLocal(state.wishlist);
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.wishlist = action.payload.wishlist;
          saveLocal(state.wishlist);
          return;
        }
        const { productId, productSnapshot } = action.payload.payload;
        const items = state.wishlist.items || [];
        if (!items.some((it) => it.productId === productId)) {
          items.push({
            productId,
            nameAtAdd: productSnapshot?.name || '',
            priceAtAdd: productSnapshot?.price || 0,
            imageAtAdd: productSnapshot?.image || '',
          });
        }
        state.wishlist.items = items;
        saveLocal(state.wishlist);
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.wishlist = action.payload.wishlist;
          saveLocal(state.wishlist);
          return;
        }
        const { productId } = action.payload.payload;
        state.wishlist.items = (state.wishlist.items || []).filter((it) => it.productId !== productId);
        saveLocal(state.wishlist);
      })
      .addCase('auth/logout', (state) => {
        state.wishlist = emptyWishlist();
        localStorage.removeItem('hw_wishlist');
      });
  },
});

export default wishlistSlice.reducer;

