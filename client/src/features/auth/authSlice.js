import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi.js";
import { authStorage } from "../../utils/authStorage.js";

function loadPersisted() {
  return { token: authStorage.getToken() || null, user: authStorage.getUser() };
}

function persist({ token, user }) {
  authStorage.setToken(token);
  authStorage.setUser(user);
}

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      return await authApi.register({ name, email, password });
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Registration failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authApi.login({ email, password });
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

const initialPersisted = loadPersisted();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialPersisted.token,
    user: initialPersisted.user,
    status: "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      persist({ token: null, user: null });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        persist({ token: state.token, user: state.user });
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        persist({ token: state.token, user: state.user });
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  }
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsAuthed = (state) => Boolean(state.auth.token);

