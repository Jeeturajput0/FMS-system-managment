import { createAsyncThunk } from "@reduxjs/toolkit"; import { feeService } from "../../services/fee.service";
export const fetchFees = createAsyncThunk("fees/fetchFees", async (params, { rejectWithValue }) => { try { return await feeService.getFees(params); } catch (e) { return rejectWithValue(e.message || "Failed to load fees"); } });
export const recordPayment = createAsyncThunk("fees/recordPayment", async (arg, { rejectWithValue }) => { try { return await feeService.recordPayment(arg); } catch (e) { return rejectWithValue(e.message || "Failed to record payment"); } });
