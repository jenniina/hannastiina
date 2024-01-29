import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import categoryService from '../services/kategoriat'

import { ICategory, ICategoryState } from '../types'
import { AxiosError } from 'axios'

const initialState: ICategoryState = {
  categories: [],
  loading: false,
  error: undefined,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await categoryService.getAll()
    return response
  }
)

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (
    category: { kategoria: string; viimeisinMuokkaus: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await categoryService.addCategory(category)
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

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: number; category: ICategory }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, category)
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

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteCategory(id)
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

export const getCategoryOrder = createAsyncThunk(
  'categories/getCategoryOrder',
  async () => {
    const response = await categoryService.getCategoryOrder()
    return response
  }
)

export const updateCategoryOrder = createAsyncThunk(
  'categories/updateCategoryOrder',
  async (newObject: number[], { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategoryOrder(newObject)
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

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload
      state.loading = false
    })
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.error = action.error.message
      state.loading = false
    })
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.categories = state.categories.concat(action.payload)
      state.loading = false
    })
    builder.addCase(addCategory.rejected, (state, action) => {
      state.error = action.error.message
      state.loading = false
    })
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const id = action.payload.id
      const updatedCategory = action.payload

      state.categories = state.categories.map((category) =>
        category.id !== id ? category : updatedCategory
      )
      state.loading = false
    })
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.error.message
      state.loading = false
    })
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true
    })

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      const id = action.payload.id
      state.categories = state.categories.filter((category) => category.id !== id)
      state.loading = false
    })
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.error.message
      state.loading = false
    })

    builder.addDefaultCase((state) => {
      state.loading = false
    })
  },
})

export default categorySlice.reducer
