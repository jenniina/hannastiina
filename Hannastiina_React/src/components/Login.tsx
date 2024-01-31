import { useEffect, useState, FormEvent } from 'react'
import Accordion from './Accordion'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { notify } from '../reducers/notificationReducer'
import { initializeUser, login, logout } from '../reducers/usersReducer'
import { useSelector } from 'react-redux'
import { IReducers } from '../types'

interface LoginProps {
  setIsFormOpen?: (isFormOpen: boolean) => void
  isOpen?: boolean
  text?: string
}

const Login = ({ setIsFormOpen, isOpen, text }: LoginProps) => {
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const user = useSelector((state: IReducers) => {
    return state.users?.user
  })

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  const handleLogout = () => {
    dispatch(logout())
      .then(() => dispatch(notify(`Kirjauduttu ulos`, false, 3)))
      .catch((e) => {
        console.error(e)
        dispatch(notify(`Virhe: ${e.message}`, true, 8))
      })
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    dispatch(notify(`Kirjaudutaan sisään...`, false, 3))
    setLoggingIn(true)
    await dispatch(login(username, password))
      .then(() => {
        setLoggingIn(false)
        setUsername('')
        setPassword('')
        setIsFormOpen && setIsFormOpen(false)
        dispatch(notify(`Kirjauduttu sisään`, false, 3))
        // scroll to top
        const anchor = document.querySelector(`#nav`)
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth' })
        }
      })
      .catch((e) => {
        setLoggingIn(false)
        console.error(e)
        if (e.code === 'ERR_BAD_REQUEST')
          dispatch(notify(`Virhe: ${e.response.data.message}`, true, 8))
        else if (e.code === 'ERR_NETWORK') {
          dispatch(notify(`Virhe: ${e.message}`, true, 8))
        }
      })
  }

  return (
    <>
      {user ? (
        <div className='logout-wrap'>
          <span>Kirjauduttu nimellä {user?.name ? user?.name : user.username} </span>
          <button
            onClick={handleLogout}
            id={`logout-${text}`}
            className={`logout danger ${text}`}
          >
            Kirjaudu ulos &times;
          </button>
        </div>
      ) : (
        <>
          <Accordion
            id='login'
            className='login'
            text='Ylläpito'
            setIsFormOpen={setIsFormOpen}
            isOpen={isOpen}
            hideBrackets={true}
          >
            <div>
              <h2>Kirjaudu</h2>

              <form onSubmit={handleLogin} className='login'>
                <div className='input-wrap'>
                  <label>
                    <span>Sähköposti: </span>
                  </label>
                  <span className='input'>
                    <input
                      name='username'
                      type='email'
                      value={username}
                      required
                      autoComplete='email'
                      onChange={({ target }) => setUsername(target.value)}
                    />
                  </span>
                </div>
                <div className='input-wrap'>
                  <label>
                    <span>Salasana: </span>
                  </label>
                  <span className='input'>
                    <input
                      name='password'
                      type='password'
                      required
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                    />
                  </span>
                </div>
                <button
                  type='submit'
                  id={`login-${text}`}
                  className={`login ${text} restore`}
                >
                  {loggingIn ? 'Kirjaudutaan...' : 'Kirjaudu'}
                </button>
              </form>
            </div>
          </Accordion>
        </>
      )}
    </>
  )
}

export default Login
