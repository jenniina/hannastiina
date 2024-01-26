import { useSelector } from 'react-redux'
import { IReducers } from '../types'
import { useEffect, useState } from 'react'

interface Props {
  className?: string
}
const Notification = ({ className }: Props) => {
  const notification = useSelector((state: IReducers) => state.notification)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setClosed(false)
  }, [notification])

  if (notification === null || closed) {
    return null
  }

  return (
    <div
      className={`notification ${className} ${notification.isError ? 'error' : ''}`}
      aria-live='polite'
    >
      <p>
        {notification.message}{' '}
        <button
          type='button'
          className='close'
          onClick={() => {
            setClosed(true)
          }}
        >
          <span>Sulje</span>
          <span aria-hidden='true' className='times'>
            &times;
          </span>
        </button>
      </p>
    </div>
  )
}

export default Notification
