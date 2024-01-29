import { useScrollbarWidth } from './hooks/useScrollbarWidth'
import useWindowSize from './hooks/useWindowSize'
import ServiceEdit from './components/ServiceEdit'
import ServiceList from './components/ServiceList'
import Login from './components/Login'
import Notification from './components/Notification'
import { useOutsideClick } from './hooks/useOutsideClick'
import { useEffect, useState } from 'react'
import Intro from './components/Intro'
import Users from './components/UsersEdit'
import CategoryEdit from './components/CategoryEdit'
import Map from './components/Map'
import { IUser, IReducers } from './types'
import { useSelector } from 'react-redux'
import { useAppDispatch } from './hooks/useAppDispatch'
import { initializeUser, initializeUsers } from './reducers/usersReducer'
import Header from './components/Header'

function App() {
  const user = useSelector((state: IReducers) => state.users?.user as IUser)
  const users = useSelector((state: IReducers) => state.users?.users as IUser[])
  const [isOpen, setIsOpen] = useState(false)
  const scrollbarWidth = useScrollbarWidth()

  function closing() {
    setIsOpen(false)
  }
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  useEffect(() => {
    if (user && user?.role !== undefined && user?.role !== null && Number(user?.role) > 1)
      dispatch(initializeUsers())
  }, [user])

  const ref = useOutsideClick({ onOutsideClick: closing })

  const styleInnerWrap: React.CSSProperties = {
    ['--scrollbar-width' as string]: `${scrollbarWidth}px`,
  }

  const { windowWidth, windowHeight } = useWindowSize()

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} t ${mins} min` : `${mins} min`
  }

  const handleScrollToElement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault()
    const anchor = document.querySelector(`#${id}`)
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div style={styleInnerWrap}>
      <Header
        user={user}
        handleScrollToElement={handleScrollToElement}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
      />
      <main id='main'>
        <div className='inner-container'>
          {user && (
            <>
              <div className='top-links'>
                <div>
                  {user?.role !== undefined &&
                    user?.role !== null &&
                    Number(user?.role) !== 1 && (
                      <button
                        onClick={(e) => {
                          handleScrollToElement(e, 'kayttajat')
                        }}
                      >
                        <span>Käyttäjät</span>
                        <span className='around'>&#xFE3D;</span>
                      </button>
                    )}

                  {user?.role !== undefined &&
                    user?.role !== null &&
                    Number(user?.role) > 1 && (
                      <button
                        onClick={(e) => {
                          handleScrollToElement(e, 'kategoriat')
                        }}
                      >
                        <span>Kategoriat</span>
                        <span className='around'>&#xFE3D;</span>
                      </button>
                    )}

                  {user?.role !== undefined &&
                    user?.role !== null &&
                    Number(user?.role) !== 1 && (
                      <button
                        onClick={(e) => {
                          handleScrollToElement(e, 'palvelut')
                        }}
                      >
                        <span>Palvelut</span>
                        <span className='around'>&#xFE3D;</span>
                      </button>
                    )}
                </div>
              </div>
            </>
          )}
          <Intro user={user} />
          {!user && <Map windowHeight={windowHeight} />}
          {user && Number(user?.role) !== 1 ? (
            <Users user={user} users={users} windowWidth={windowWidth} />
          ) : null}
          {user &&
            user?.role !== undefined &&
            user?.role !== null &&
            Number(user?.role) > 1 && <CategoryEdit user={user} />}
          {user ? (
            <ServiceEdit
              user={user}
              formatDuration={formatDuration}
              handleScrollToElement={handleScrollToElement}
            />
          ) : (
            <ServiceList formatDuration={formatDuration} windowWidth={windowWidth} />
          )}
        </div>
      </main>
      <footer id='footer'>
        <div className='inner-container'>
          <address>
            <h2 id='yhteystiedot'>Yhteystiedot</h2>
            <p>
              <strong>Parturi Kampaamo Hannastiina</strong>{' '}
            </p>
            <p>
              <strong>Puhelin: </strong>{' '}
              <span>
                <a href='tel:095666124'>09 566 6124</a>
              </span>
            </p>
            <p>
              <strong>Osoite: </strong>
              <span>Sitratie 1, 00420 Helsinki</span>
            </p>
          </address>
          <div id='aukioloajat'>
            <h2>Aukioloajat</h2>
            <p>Sopimuksen mukaan</p>

            <div className={`login-wrap ${isOpen ? 'open' : ''}`}>
              <div ref={ref}>
                <Login isOpen={isOpen} setIsFormOpen={setIsOpen} text='etusivu' />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Notification />
    </div>
  )
}

export default App

// eslint-disable-line
