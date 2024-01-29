import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import palvelutService from '../services/palvelut'
import { IService, IServiceState } from '../types'
import { AxiosError } from 'axios'

const initialState: IServiceState = {
  services: [],
  loading: false,
  error: null,
}

export const fetchServices = createAsyncThunk('services/fetchServices', async () => {
  try {
    const response: IService[] = await palvelutService.getAll()
    return response
  } catch (error) {
    throw new Error('Virhe palveluiden haussa')
  }
})

export const searchPriceRange = createAsyncThunk(
  'services/searchPriceRange',
  async ({ min, max }: { min: number; max: number }) => {
    try {
      const response = await palvelutService.searchPriceRange(min, max)
      return response
    } catch (error) {
      throw new Error('Virhe palveluiden haussa')
    }
  }
)

export const fetchServiceByName = createAsyncThunk(
  'services/fetchServiceByName',
  async (name: string) => {
    try {
      const response = await palvelutService.getServiceByName(name)
      return response
    } catch (error) {
      throw new Error('Virhe palveluiden haussa')
    }
  }
)

export const addService = createAsyncThunk(
  'services/addService',
  async (newObject: IService, { rejectWithValue }) => {
    try {
      const response = await palvelutService.addService(newObject)
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
    return rejectWithValue({ message: 'Palvelun lisäys epäonnistui' })
  }
)

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, newObject }: { id: number; newObject: IService }, { rejectWithValue }) => {
    try {
      const response = await palvelutService.updateService(id, newObject)
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

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await palvelutService.deleteService(id)
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
    return rejectWithValue({ message: 'Palvelun poisto epäonnistui' })
  }
)

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Virhe palveluiden haussa'
      })
      .addCase(fetchServiceByName.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServiceByName.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(fetchServiceByName.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Palvelua ei löytynyt tällä nimellä'
      })
      .addCase(searchPriceRange.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchPriceRange.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(searchPriceRange.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Palvelua ei löytynyt tällä hinnalla'
      })
      .addCase(addService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.loading = false
        state.services = [...state.services, action.payload]
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Palvelun lisääminen epäonnistui'
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services?.map((service) =>
          service.id === action.payload.id ? action.payload : service
        )
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Palvelun päivittäminen epäonnistui'
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false
        state.services = state.services?.filter(
          (service) => service.id !== action.payload.id
        )
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Palvelun poistaminen epäonnistui'
      })
  },
})

export default serviceSlice.reducer
