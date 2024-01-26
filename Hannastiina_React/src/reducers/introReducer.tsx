import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import introService from '../services/esittely'
import { IIntroState } from '../types'

const initialState: IIntroState = {
  esittely: [],
  loading: false,
  error: null,
}

export const fetchIntro = createAsyncThunk('intro/fetchIntro', async () => {
  const response = await introService.getIntro()
  return response
})

// export const addIntro = createAsyncThunk('intro/addIntro', async (newObject: string) => {
//   const response = await introService.addIntro(newObject)
//   return response
// })

export const updateIntro = createAsyncThunk(
  'intro/updateIntro',
  async ({ id, newObject }: { id: number; newObject: string }) => {
    const response = await introService.updateIntro(id, newObject)
    return response
  }
)

// export const deleteIntro = createAsyncThunk('intro/deleteIntro', async (id: number) => {
//   const response = await introService.deleteIntro(id)
//   return response
// })

const introSlice = createSlice({
  name: 'intro',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntro.pending, (state, _action) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIntro.fulfilled, (state, action) => {
        state.loading = false
        state.esittely = action.payload
      })
      //   .addCase(addIntro.pending, (state, _action) => {
      //     state.loading = true
      //     state.error = null
      //   })
      //   .addCase(addIntro.fulfilled, (state, action) => {
      //     state.loading = false
      //     if (state.esittely) state.esittely.esittely = action.payload
      //     else state.esittely = { esittely: action.payload }
      //   })
      .addCase(updateIntro.pending, (state, _action) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateIntro.fulfilled, (state, action) => {
        state.loading = false
        state.esittely[0].esittely = action.payload
      })
    //   .addCase(deleteIntro.pending, (state, _action) => {
    //     state.loading = true
    //     state.error = null
    //   })
    //   .addCase(deleteIntro.fulfilled, (state, action) => {
    //     state.loading = false
    //     if (state.esittely) state.esittely.esittely = action.payload
    //     else state.esittely = { esittely: action.payload }
    //   })
  },
})

export default introSlice.reducer
