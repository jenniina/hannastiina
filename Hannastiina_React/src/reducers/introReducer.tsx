import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import introService from '../services/esittely'
import { IIntroState } from '../types'
import { AxiosError } from 'axios'

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
  async (
    {
      id,
      newObject,
    }: {
      id: number
      newObject: { esittely: string; viimeisinMuokkaus: number }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await introService.updateIntro(id, newObject)
      return response
    } catch (error) {
      // Use a type guard to check if error is an instance of AxiosError
      if (error instanceof AxiosError) {
        console.error(error)
        // If axios threw an error, it will be available in error.response
        if (error.response) {
          // We reject with the error message from the server
          return rejectWithValue(error.response.data.message)
        }
      }
      // If the error was caused by something else, we reject with a generic error message
      return rejectWithValue({ message: 'Esittelyn päivitys epäonnistui' })
    }
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
      .addCase(fetchIntro.rejected, (state, _action) => {
        state.loading = false
        state.error = 'Tapahtui virhe' // action.error.message
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
      .addCase(updateIntro.rejected, (state, _action) => {
        state.loading = false
        state.error = 'Tapahtui virhe -' //action.error.message
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
