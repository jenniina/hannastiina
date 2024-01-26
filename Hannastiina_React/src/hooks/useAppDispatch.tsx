import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'

// Use throughout your app instead of plain `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
