import {
  createUser,
  initializeUsers,
  removeUser,
  updateUser,
  updatePassword,
  updateUsername,
  refreshUser,
  initializeUser,
} from '../reducers/usersReducer'
import { IUser } from '../types'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { FormEvent, useState } from 'react'
import { notify } from '../reducers/notificationReducer'

interface Props {
  user: IUser
  users: IUser[]
  windowWidth: number
}

const Users = ({ user, users, windowWidth }: Props) => {
  const dispatch = useAppDispatch()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [passwordOld, setPasswordOld] = useState('')
  const [user_username, setUser_username] = useState(user?.username as string)
  const [user_name, setUser_name] = useState(user?.name as string)

  const addUser = async (event: FormEvent) => {
    event.preventDefault()
    if (password !== passwordAgain) {
      dispatch(notify('Salasanat eivät täsmää', true, 5))
      return
    }

    let role = 1

    const adminCheckbox = document.getElementById('admin') as HTMLInputElement
    if (adminCheckbox?.checked) {
      role = 2
    }

    const newUser: IUser = {
      username,
      name,
      password,
      role,
    }
    dispatch(createUser(newUser))
      .then(() => {
        setUsername('')
        setName('')
        setPassword('')
        setPasswordAgain('')
        dispatch(notify('Käyttäjä luotu', false, 5))
      })
      .then(() => dispatch(initializeUsers()))
      .catch((e) => {
        console.error(e)
        dispatch(notify(`Virhe: ${e.response.data.message}`, true, 8))
      })
  }
  return (
    <>
      {user?.role && Number(user?.role) > 1 && (
        <div className='edit'>
          <section id='kayttajat' className='card kayttajat'>
            <h2>Käyttäjähallinta</h2>
            <h3>Käyttäjälista</h3>
            {windowWidth > 600 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nimi</th>
                    <th>Sähköposti</th>
                    <th>Ylläpitäjä</th>
                    <th>Poista</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr
                      key={u?._id}
                      className={`${u?.role && u.role > 1 ? 'admin' : ''} `}
                    >
                      <td>
                        <span>{u?.name}</span>
                      </td>
                      <td>
                        <span>{u?.username}</span>
                      </td>
                      <td>
                        <span>{u?.role && u.role > 1 ? 'Kyllä' : 'Ei'}</span>
                      </td>
                      <td>
                        {user._id !== u._id && Number(u.id) !== 7 && (
                          <button
                            className='danger smaller'
                            onClick={() => {
                              if (window.confirm(`Poistetaanko ${u.name}?`))
                                dispatch(removeUser(u._id))
                                  .then(() =>
                                    dispatch(notify('Käyttäjä poistettu', false, 5))
                                  )
                                  .then(() => dispatch(initializeUsers()))
                                  .catch((e) => {
                                    console.error(e)
                                    dispatch(
                                      notify(`Virhe: ${e.response.data.message}`, true, 8)
                                    )
                                  })
                            }}
                          >
                            Poista
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <ul>
                {users?.map((u) => (
                  <li key={u?._id} className={`${u?.role && u.role > 1 ? 'admin' : ''} `}>
                    <span>{u?.name}</span>
                    <span>({u?.username})</span>
                    <span>{u?.role && u.role > 1 ? 'Ylläpitäjä' : ''}</span>
                    {user._id !== u._id && (
                      <button
                        className='danger smaller'
                        onClick={() => {
                          if (window.confirm(`Poistetaanko ${u.name}?`))
                            dispatch(removeUser(u._id))
                              .then(() =>
                                dispatch(notify('Käyttäjä poistettu', false, 5))
                              )
                              .then(() => dispatch(initializeUsers()))
                              .catch((e) => {
                                console.error(e)
                                dispatch(
                                  notify(`Virhe: ${e.response.data.message}`, true, 8)
                                )
                              })
                        }}
                      >
                        <span>Poista</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <h3>Omat tiedot</h3>
            <h4>Salasanan vaihto</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (password !== passwordAgain) {
                  dispatch(notify('Salasanat eivät täsmää', true, 5))
                  return
                }
                dispatch(updatePassword({ _id: user?._id, password, passwordOld }))
                  .then(() => {
                    setUsername('')
                    setPassword('')
                    setPasswordOld('')
                    dispatch(notify('Salasana vaihdettu', false, 5))
                  })
                  .catch((e) => {
                    console.error(e)
                    dispatch(notify(`Virhe: ${e.response.data.message}`, true, 8))
                  })
              }}
            >
              <div className='input-wrap'>
                <label htmlFor='password-old'>Nykyinen salasana: </label>
                <span className='input'>
                  <input
                    id='password-old'
                    type='password'
                    name='passwordOld'
                    value={passwordOld}
                    onChange={({ target }) => setPasswordOld(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-change'>Uusi salasana: </label>
                <span className='input'>
                  <input
                    id='password-change'
                    type='password'
                    name='password'
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-change2'>Uusi salasana uudelleen: </label>
                <span className='input'>
                  <input
                    id='password-change2'
                    type='password'
                    name='password'
                    value={passwordAgain}
                    onChange={({ target }) => setPasswordAgain(target.value)}
                  />
                </span>
              </div>
              <button type='submit'>Vaihda salasana</button>
            </form>

            <h4>Muokkaa nimeäsi</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                dispatch(updateUser({ _id: user?._id, name: user_name, passwordOld }))
                  .then((u) => dispatch(refreshUser(u.user)))
                  .then(() => {
                    setUsername('')
                    setName('')
                    setPasswordOld('')
                    dispatch(notify('Nimi vaihdettu', false, 5))
                  })
                  .then(() => dispatch(initializeUser()))
                  .catch((e) => {
                    console.error(e)
                    dispatch(notify(`Virhe: ${e.response.data.message}`, true, 8))
                  })
              }}
            >
              <div className='input-wrap'>
                <label htmlFor='name-change'>Nimi: </label>
                <span className='input'>
                  <input
                    id='name-change'
                    type='text'
                    name='name'
                    value={user_name}
                    onChange={({ target }) => setUser_name(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-old2'>Salasana: </label>
                <span className='input'>
                  <input
                    id='password-old2'
                    type='password'
                    name='passwordOld'
                    value={passwordOld}
                    onChange={({ target }) => setPasswordOld(target.value)}
                  />
                </span>
              </div>
              <button type='submit'>Vaihda nimi</button>
            </form>

            <h4>Muokkaa sähköpostiasi</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault()

                dispatch(
                  updateUsername({ _id: user?._id, username: user_username, passwordOld })
                )
                  .then((u) => dispatch(refreshUser(u.user)))
                  .then(() => {
                    setUsername('')
                    setName('')
                    setPasswordOld('')
                    dispatch(notify('Sähköposti vaihdettu', false, 5))
                  })
                  .then(() => dispatch(initializeUser()))
                  .catch((e) => {
                    console.error(e)
                    dispatch(notify(`Virhe: ${e.response.data.message}`, true, 8))
                  })
              }}
            >
              <div className='input-wrap'>
                <label htmlFor='username-change'>Sähköposti: </label>
                <span className='input'>
                  <input
                    id='username-change'
                    type='text'
                    name='username'
                    value={user_username}
                    onChange={({ target }) => setUser_username(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-old3'>Salasana: </label>
                <span className='input'>
                  <input
                    id='password-old3'
                    type='password'
                    name='passwordOld'
                    value={passwordOld}
                    onChange={({ target }) => setPasswordOld(target.value)}
                  />
                </span>
              </div>
              <button type='submit'>Vaihda sähköposti</button>
            </form>

            <h3>Lisää uusi käyttäjä</h3>
            <form onSubmit={addUser}>
              <div className='input-wrap'>
                <label htmlFor='username-create'>Sähköposti:</label>
                <span className='input'>
                  <input
                    id='username-create'
                    type='text'
                    name='username'
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='name-create'>Nimi: </label>
                <span className='input'>
                  <input
                    id='name-create'
                    type='text'
                    name='name'
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-create'>Salasana: </label>
                <span className='input'>
                  <input
                    id='password-create'
                    type='password'
                    name='password'
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='password-create2'>Salasana uudelleen: </label>
                <span className='input'>
                  <input
                    id='password-create2'
                    type='password'
                    name='passwordAgain'
                    value={passwordAgain}
                    onChange={({ target }) => setPasswordAgain(target.value)}
                  />
                </span>
              </div>
              <div className='input-wrap'>
                <label htmlFor='admin'>Ylläpitäjä: </label>
                <span className='admin-input-wrap'>
                  <input id='admin' type='checkbox' name='admin' />
                </span>
              </div>
              <button type='submit'>Luo käyttäjä</button>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default Users
