import { createSlice } from "@reduxjs/toolkit";
import { login, register, fetchCurrentUser } from "./authThunks";
import { resetServerState } from "../reset";
const storedUser = (() => { try { return JSON.parse(localStorage.getItem("ai_scholars_user") || "null"); } catch { return null; } })();
const persist = (state, payload) => { localStorage.setItem("ai_scholars_token", payload.token); localStorage.setItem("ai_scholars_user", JSON.stringify(payload.user)); state.token = payload.token; state.user = payload.user; state.authenticated = true; };
const authSlice = createSlice({ name: "auth", initialState: { user: storedUser, token: localStorage.getItem("ai_scholars_token"), authenticated: Boolean(localStorage.getItem("ai_scholars_token") && storedUser), loading: false, error: null }, reducers: { logout(state) { localStorage.removeItem("ai_scholars_token"); localStorage.removeItem("ai_scholars_user"); state.user = null; state.token = null; state.authenticated = false; state.error = null; } }, extraReducers: (builder) => builder
  .addCase(login.pending, (s) => { s.loading = true; s.error = null; }).addCase(login.fulfilled, (s, a) => { s.loading = false; persist(s, a.payload); }).addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
  .addCase(register.pending, (s) => { s.loading = true; s.error = null; }).addCase(register.fulfilled, (s, a) => { s.loading = false; persist(s, a.payload); }).addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
  .addCase(fetchCurrentUser.fulfilled, (s, a) => { s.user = a.payload; s.authenticated = true; localStorage.setItem("ai_scholars_user", JSON.stringify(a.payload)); }).addCase(fetchCurrentUser.rejected, (s, a) => { s.user = null; s.token = null; s.authenticated = false; s.error = a.payload; })
  .addCase(resetServerState, () => ({ user: null, token: null, authenticated: false, loading: false, error: null })) });
export const { logout } = authSlice.actions;
export default authSlice.reducer;
