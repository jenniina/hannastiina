import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import { IUser } from '../types'
import { AxiosResponse } from 'axios'

const initialState = {
  user: null,
  users: [] as IUser[],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload)
      //state.push(action.payload);
      //[...state.users, action.payload]
      //   const updatedUser = action.payload
      //   return state.users.map((user) => (user._id !== updatedUser._id ? user : updatedUser))
    },
    setUsers(state, action) {
      state.users = action.payload
    },
    remove(state, action) {
      state.users = state.users.filter((user) => user._id !== action.payload)
    },
    update(state, action) {
      const updatedUser = action.payload
      const userIndex = state.users.findIndex((user) => user._id === updatedUser._id)
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser
      }
    },
    searchUsername(state, action) {
      state.users = state.users.filter(
        (user) => user.username === action.payload.username
      )
    },
    searchId(state, action) {
      state.users = state.users.filter((user) => user._id === action.payload._id)
    },
    updateToken(state, action) {
      const updatedUser = action.payload
      const userIndex = state.users.findIndex((user) => user._id === updatedUser._id)
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser
      }
    },
    forgotPassword(_state, action) {
      action.payload
    },
    setUser(state, action) {
      state.user = action.payload
    },
    loginUser(state, action) {
      state.user = action.payload
    },
    logoutUser(state, _action) {
      state.user = null
    },
  },
})

export const initializeUser = () => {
  return async (dispatch: (arg0: { payload: any; type: 'users/setUser' }) => void) => {
    const loggedToken = window.localStorage.getItem('HannastiinaToken')
    if (loggedToken) {
      userService.setToken(loggedToken)
    }
    const loggedUserJSON = window.localStorage.getItem('HannastiinaUser')
    if (loggedUserJSON) {
      const data = JSON.parse(loggedUserJSON)
      dispatch(setUser(data.user))
    }
  }
}

export const login = (username: string, password: string) => {
  return async (dispatch: (arg0: { payload: any; type: 'users/loginUser' }) => void) => {
    const response = await userService.login({
      username,
      password,
    })
    window.localStorage.setItem(
      'HannastiinaUser',
      JSON.stringify({ user: response.user, token: response.token })
    )
    userService.setToken(response.token)
    dispatch(loginUser(response.user))
    return response
  }
}

export const findUserById = (id: string) => {
  return async (dispatch: (arg0: { payload: any; type: 'users/searchId' }) => IUser) => {
    const user = await userService.searchId(id)
    dispatch({ type: 'users/searchId', payload: user })
    const token = window.localStorage.getItem('HannastiinaToken')
    window.localStorage.setItem('HannastiinaUser', JSON.stringify({ user, token }))
    return user
  }
}

export const initializeUsers = () => {
  return async (dispatch: (arg0: { payload: any; type: 'users/setUsers' }) => void) => {
    const users = await userService.getAll()
    dispatch({ type: 'users/setUsers', payload: users })
  }
}

interface IContent {
  success: boolean
  user: IUser
  message: string
}

export const createUser = (newUser: IUser) => {
  return async (
    dispatch: (arg0: { payload: IUser; type: 'users/addUser' }) => IContent
  ) => {
    const response = (await userService.createNewUser(newUser)) as AxiosResponse<IContent>
    dispatch(addUser(response))
    return response
  }
}

export const removeUser = (id: IUser['_id']) => {
  return async (
    dispatch: (arg0: { payload: IUser['_id']; type: 'users/remove' }) => void
  ) => {
    const deletedUser = await userService.deleteUser(id)
    dispatch(remove(deletedUser))
  }
}

export const updateUser = (
  user: Pick<IUser, '_id' | 'name' | 'passwordOld' | 'verified'>
) => {
  return async (dispatch: (arg0: { payload: IUser; type: 'users/update' }) => IUser) => {
    const content: IContent = await userService.updateUser(user)
    dispatch(update(content.user))
    return content
  }
}

export const updateUsername = (user: Pick<IUser, '_id' | 'username' | 'passwordOld'>) => {
  return async () => {
    const content: IContent = await userService.updateUsername(user)
    return content
  }
}

export const updatePassword = (user: Pick<IUser, '_id' | 'password' | 'passwordOld'>) => {
  return async (dispatch: (arg0: { payload: IUser; type: 'users/update' }) => IUser) => {
    const content: IContent = await userService.updatePassword(user)
    dispatch(update(content.user))
    return content
  }
}

export const updateUserToken = (user: Pick<IUser, 'username'>) => {
  return async (
    dispatch: (arg0: { payload: any; type: 'users/updateToken' }) => void
  ) => {
    const updated: IContent = await userService.updateToken(user)
    dispatch(updateToken(updated))
  }
}

export const forgot = (username: string | undefined) => {
  return async (
    dispatch: (arg0: { payload: any; type: 'users/forgotPassword' }) => void
  ) => {
    if (username) {
      const updated: IContent = await userService.forgot(username)
      dispatch(forgotPassword(updated))
      return updated
    } else {
      return {
        success: false,
        message: `Toiminto tarvitsee pätevän sähköpostin`,
      }
    }
  }
}

export const logout = () => {
  return async (dispatch: (arg0: { payload: any; type: 'users/logoutUser' }) => void) => {
    window.localStorage.removeItem('HannastiinaUser')
    dispatch(logoutUser(null))
  }
}

export const refreshUser = (user: IUser) => {
  return async (dispatch: (arg0: { payload: any; type: 'users/setUser' }) => void) => {
    const loggedUserJSON = window.localStorage.getItem('HannastiinaUser')
    if (loggedUserJSON) {
      const data = JSON.parse(loggedUserJSON)
      const token = data.token
      if (token) {
        userService.setToken(token) // Set the token in the userService
      }
      window.localStorage.setItem('HannastiinaUser', JSON.stringify({ user, token }))
      dispatch(setUser(user))
    }
  }
}

export const {
  addUser,
  setUsers,
  remove,
  update,
  searchUsername,
  searchId,
  updateToken,
  forgotPassword,
  setUser,
  loginUser,
  logoutUser,
} = usersSlice.actions
export default usersSlice.reducer
