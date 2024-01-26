import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    newNotification(_state, action) {
      return action.payload
    },
  },
})

export const notify = (message: string | null, isError: boolean, seconds: number) => {
  return async (
    dispatch: (arg0: {
      payload: { message: string | null; isError: boolean }
      type: 'notification/newNotification'
    }) => void
  ) => {
    dispatch(newNotification({ message, isError }))

    setTimeout(() => dispatch(newNotification(null)), seconds * 1000)
  }
}

export const { newNotification } = notificationSlice.actions
export default notificationSlice.reducer
