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
    if (user && Number(user?.role) > 1)
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
    else dispatch(notify('Ei oikeuksia luoda käyttäjää', true, 5))
  }

  return (
    <>
      {user && Number(user?.role) !== 1 ? (
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
                    <th>Rooli</th>
                    <th>Poista</th>
                  </tr>
                </thead>
                <tbody>
                  {user && Number(user?.role) > 1 ? (
                    users
                      ?.slice()
                      ?.sort(
                        (a, b) =>
                          (Number(b?.role) || 0) - (Number(a?.role) || 0) ||
                          (Number(a?.id) || 0) - (Number(b?.id) || 0)
                      )
                      ?.map((u) => {
                        return (
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
                              <span>
                                {u?.role && Number(u.role) > 2
                                  ? 'Omistaja'
                                  : u?.role && Number(u.role) > 1
                                  ? 'Hallinnoija'
                                  : u?.role && Number(u.role) > 0
                                  ? 'Valtuutettu'
                                  : 'Testaaja'}
                              </span>
                            </td>
                            <td>
                              {user._id !== u._id && Number(u.role) < 3 && (
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
                                            notify(
                                              `Virhe: ${e.response.data.message}`,
                                              true,
                                              8
                                            )
                                          )
                                        })
                                  }}
                                >
                                  Poista
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                  ) : (
                    <>
                      <tr>
                        <td>
                          <span>Admin</span>
                        </td>
                        <td>
                          <span>admin@hannastii.na</span>
                        </td>
                        <td>
                          <span>Hallinnoija</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>
                          <span>Testaaja</span>
                        </td>
                        <td>
                          <span>testi@testaaja.fi</span>
                        </td>
                        <td>
                          <span>Testaaja</span>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>
                          <span>Tester</span>
                        </td>
                        <td>
                          <span>tester@test.ing</span>
                        </td>
                        <td>
                          <span>Testaaja</span>
                        </td>
                        <td>
                          <button
                            className='danger smaller'
                            onClick={() => {
                              if (window.confirm(`Poistetaanko Tester?`))
                                dispatch(notify('Käyttäjää ei voi poistaa', true, 5))
                            }}
                          >
                            Poista
                          </button>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            ) : (
              <ul>
                {user && Number(user?.role) > 1 ? (
                  users
                    ?.slice()
                    ?.sort(
                      (a, b) =>
                        (Number(b?.role) || 0) - (Number(a?.role) || 0) ||
                        (Number(a?.id) || 0) - (Number(b?.id) || 0)
                      //(a?.name || '').localeCompare(b?.name || '')
                    )
                    ?.map((u) => (
                      <li
                        key={u?._id}
                        className={`${u?.role && Number(u.role) > 1 ? 'admin' : ''} `}
                      >
                        <span>{u?.name}</span>
                        <span>({u?.username})</span>
                        <span>
                          {u?.role && Number(u.role) > 2
                            ? 'Omistaja'
                            : u?.role && Number(u.role) > 1
                            ? 'Hallinnoija'
                            : ''}
                        </span>
                        {user._id !== u._id && Number(u.role) < 3 && (
                          <button
                            className='danger smaller'
                            onClick={() => {
                              if (
                                user &&
                                Number(user?.role) > 1 &&
                                window.confirm(`Poistetaanko ${u.name}?`)
                              )
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
                              else dispatch(notify('Käyttäjää ei voi poistaa', true, 5))
                            }}
                          >
                            <span>Poista</span>
                          </button>
                        )}
                      </li>
                    ))
                ) : (
                  <>
                    <li>
                      <span>Admin</span>
                      <span>(admin@hannastii.na)</span>
                      <span>Hallinnoija</span>
                    </li>
                    <li>
                      <span>Testaaja</span>
                      <span>(testi@testaaja.fi)</span>
                      <span>Testaaja</span>
                    </li>
                    <li>
                      <span>Tester</span>
                      <span>(tester@test.ing)</span>
                      <span>Testaaja</span>
                      <button
                        className='danger smaller'
                        onClick={() => {
                          if (window.confirm(`Poistetaanko Tester?`))
                            dispatch(notify('Käyttäjää ei voi poistaa', true, 5))
                        }}
                      >
                        Poista
                      </button>
                    </li>
                  </>
                )}
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
                if (user && Number(user?.role) > 0)
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
                else dispatch(notify('Ei oikeuksia vaihtaa salasanaa', true, 5))
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
                if (user && Number(user?.role) > 0)
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
                else dispatch(notify('Ei oikeuksia vaihtaa nimeä', true, 5))
              }}
            >
              <div className='input-wrap'>
                <label htmlFor='name-change'>Nimi: </label>
                <span className='input'>
                  <input
                    id='name-change'
                    type='text'
                    name='name'
                    autoComplete='name'
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
                if (user && Number(user?.role) > 0)
                  dispatch(
                    updateUsername({
                      _id: user?._id,
                      username: user_username,
                      passwordOld,
                    })
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
                else dispatch(notify('Ei oikeuksia vaihtaa sähköpostia', true, 5))
              }}
            >
              <div className='input-wrap'>
                <label htmlFor='username-change'>Sähköposti: </label>
                <span className='input'>
                  <input
                    id='username-change'
                    type='email'
                    name='username'
                    autoComplete='email'
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
                    type='email'
                    name='username'
                    autoComplete='email'
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
                    autoComplete='name'
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
      ) : (
        <></>
      )}
    </>
  )
}

export default Users
