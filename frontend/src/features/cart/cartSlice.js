import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/apiClient';

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem('hw_cart') || 'null');
  } catch {
    return null;
  }
}

function saveLocal(cart) {
  localStorage.setItem('hw_cart', JSON.stringify(cart));
}

function emptyCart() {
  return { items: [] };
}

function getAuthToken(getState) {
  return getState().auth.token;
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkApi) => {
  if (!getAuthToken(thunkApi.getState)) {
    return loadLocal() || emptyCart();
  }
  const { data } = await api.get('/api/cart');
  return data.cart;
});

export const addCartItem = createAsyncThunk('cart/addCartItem', async (payload, thunkApi) => {
  const token = getAuthToken(thunkApi.getState);
  if (!token) {
    return { mode: 'local', payload };
  }
  const { data } = await api.post('/api/cart/items', payload);
  return { mode: 'remote', cart: data.cart };
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async (payload, thunkApi) => {
  const token = getAuthToken(thunkApi.getState);
  if (!token) {
    return { mode: 'local', payload };
  }
  const { data } = await api.put('/api/cart/items', payload);
  return { mode: 'remote', cart: data.cart };
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (payload, thunkApi) => {
  const token = getAuthToken(thunkApi.getState);
  if (!token) {
    return { mode: 'local', payload };
  }
  const { data } = await api.delete('/api/cart/items', { data: payload });
  return { mode: 'remote', cart: data.cart };
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkApi) => {
  const token = getAuthToken(thunkApi.getState);
  if (!token) {
    return { mode: 'local' };
  }
  const { data } = await api.delete('/api/cart');
  return { mode: 'remote', cart: data.cart };
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: loadLocal() || emptyCart(),
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload || emptyCart();
        saveLocal(state.cart);
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.cart = action.payload.cart;
          saveLocal(state.cart);
          return;
        }
        const { productId, qty = 1, size, color, productSnapshot } = action.payload.payload;
        const key = `${productId}_${size}_${color}`;
        const items = state.cart.items || [];
        const idx = items.findIndex((it) => `${it.productId}_${it.size}_${it.color}` === key);
        if (idx >= 0) items[idx].qty += Number(qty);
        else
          items.push({
            productId,
            qty: Number(qty),
            size,
            color,
            nameAtAdd: productSnapshot?.name || '',
            priceAtAdd: productSnapshot?.price || 0,
            imageAtAdd: productSnapshot?.image || '',
          });
        state.cart.items = items;
        saveLocal(state.cart);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.cart = action.payload.cart;
          saveLocal(state.cart);
          return;
        }
        const { productId, size, color, qty } = action.payload.payload;
        state.cart.items = (state.cart.items || []).map((it) =>
          it.productId === productId && it.size === size && it.color === color
            ? { ...it, qty: Math.max(1, Number(qty)) }
            : it,
        );
        saveLocal(state.cart);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.cart = action.payload.cart;
          saveLocal(state.cart);
          return;
        }
        const { productId, size, color } = action.payload.payload;
        state.cart.items = (state.cart.items || []).filter(
          (it) => !(it.productId === productId && it.size === size && it.color === color),
        );
        saveLocal(state.cart);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        if (action.payload.mode === 'remote') {
          state.cart = action.payload.cart;
          saveLocal(state.cart);
          return;
        }
        state.cart = emptyCart();
        saveLocal(state.cart);
      })
      .addCase('auth/logout', (state) => {
        state.cart = emptyCart();
        localStorage.removeItem('hw_cart');
      });
  },
});

export default cartSlice.reducer;

