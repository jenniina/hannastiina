import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import categoryService from '../services/kategoriat'

import { ICategory, ICategoryState } from '../types'

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
  async (category: { kategoria: string; viimeisinMuokkaus: number }) => {
    const response = await categoryService.addCategory(category)
    return response
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: number; category: ICategory }) => {
    const response = await categoryService.updateCategory(id, category)
    return response
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    const response = await categoryService.deleteCategory(id)
    return response
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
  async (newObject: number[]) => {
    const response = await categoryService.updateCategoryOrder(newObject)
    return response
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
