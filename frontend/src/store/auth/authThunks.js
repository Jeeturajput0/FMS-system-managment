import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";

const failure = (error, fallback) => error?.message || fallback;
export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => { try { return await authService.login(payload); } catch (error) { return rejectWithValue(failure(error, "Unable to sign in")); } });
export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => { try { return await authService.register(payload); } catch (error) { return rejectWithValue(failure(error, "Unable to register")); } });
export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => { try { return await authService.getCurrentUser(); } catch (error) { return rejectWithValue(failure(error, "Session expired")); } });
