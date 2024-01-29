import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderByService from '../services/jarjestys'
import { IOrderBy, IOrderByState } from '../types'
import { AxiosError } from 'axios'

const initialState: IOrderByState = {
  orderBy: [],
  loading: false,
  error: null,
}

export const fetchOrderBy = createAsyncThunk('orderBy/fetchOrderBy', async () => {
  const response = await orderByService.getAll()
  return response
})

export const updateOrderBy = createAsyncThunk(
  'orderBy/updateOrderBy',
  async (newObject: IOrderBy[], { rejectWithValue }) => {
    try {
      const response = await orderByService.updateOrder(newObject)
      return response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error)
        // If axios threw an error, it will be available in error.response
        if (error.response) {
          // We reject with the error message from the server
          return rejectWithValue(error.response.data.message)
        }
      }
    }
    // If the error was caused by something else, we reject with a generic error message
    return rejectWithValue({ message: 'Palvelun päivitys epäonnistui' })
  }
)

const orderBySlice = createSlice({
  name: 'orderBy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBy.pending, (state, _action) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderBy.fulfilled, (state, action) => {
        state.loading = false
        state.orderBy = action.payload
      })
      .addCase(updateOrderBy.pending, (state, _action) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderBy.fulfilled, (state, action) => {
        state.loading = false
        state.orderBy = action.payload
      })
      .addCase(updateOrderBy.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default orderBySlice.reducer
