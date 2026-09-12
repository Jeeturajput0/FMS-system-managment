import { createSlice } from "@reduxjs/toolkit";
import { resetServerState } from "./reset";
const idOf = (item) => item?._id || item?.id;
export const makeResourceSlice = (name, thunks, initial = {}) => createSlice({ name, initialState: { items: [], current: null, loading: false, error: null, success: false, pagination: null, ...initial }, reducers: { clearError: (s) => { s.error = null; }, clearSuccess: (s) => { s.success = false; }, setItems: (s, a) => { s.items = Array.isArray(a.payload) ? a.payload : []; } }, extraReducers: (builder) => {
  Object.values(thunks).forEach((thunk) => { if (!thunk?.pending) return; builder.addCase(thunk.pending, (s) => { s.loading = true; s.error = null; s.success = false; }).addCase(thunk.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error.message; }); });
  if (thunks.fetch) builder.addCase(thunks.fetch.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.items ?? a.payload; s.pagination = a.payload.pagination ?? null; });
  if (thunks.get) builder.addCase(thunks.get.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; });
  if (thunks.create) builder.addCase(thunks.create.fulfilled, (s, a) => { s.loading = false; s.success = true; s.items.unshift(a.payload); });
  if (thunks.update) builder.addCase(thunks.update.fulfilled, (s, a) => { s.loading = false; s.success = true; const id = idOf(a.payload); s.items = s.items.map((item) => idOf(item) === id ? a.payload : item); s.current = s.current && idOf(s.current) === id ? a.payload : s.current; });
  if (thunks.remove) builder.addCase(thunks.remove.fulfilled, (s, a) => { s.loading = false; s.success = true; s.items = s.items.filter((item) => idOf(item) !== a.payload); });
  builder.addCase(resetServerState, (s) => Object.assign(s, { items: [], current: null, loading: false, error: null, success: false, pagination: null }));
} });
