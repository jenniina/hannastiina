import { useSelector } from 'react-redux'
import { fetchIntro, updateIntro } from '../reducers/introReducer'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useEffect, useState } from 'react'
import { IIntro, IReducers, IUser } from '../types'
import { notify } from '../reducers/notificationReducer'

interface Props {
  user?: IUser
}

const Intro = ({ user }: Props) => {
  const dispatch = useAppDispatch()
  const intro = useSelector((state: IReducers) => state.intro)
  const [introText, setIntroText] = useState(intro?.esittely?.[0]?.esittely as string)

  const teksti =
    intro &&
    typeof intro?.esittely?.[0]?.esittely === 'string' &&
    intro?.esittely?.[0]?.esittely.trim() !== ''
      ? intro?.esittely?.[0]?.esittely?.split(/\n+/) ?? ['']
      : ['']

  useEffect(() => {
    dispatch(fetchIntro()).then((result) => {
      setIntroText(
        ((result?.payload as IIntro[])?.length > 0
          ? (result?.payload as IIntro[])[0]?.esittely
          : '') as string
      )
    })
  }, [dispatch])

  const handleUpdateIntro = async (event: any) => {
    event.preventDefault()
    event.target.intro.value = ''
    dispatch(
      updateIntro({
        id: intro?.esittely?.[0]?.id as number,
        newObject: { esittely: introText, viimeisinMuokkaus: user?.id as number },
      })
    )
      .then(() => dispatch(fetchIntro()))
      .then(() => dispatch(notify('Intro päivitetty', false, 5)))
  }

  return (
    <>
      <div className='public'>
        {!user && teksti[0] !== '' && (
          <div className='introduction'>
            {teksti?.map((rivi, index) => {
              return <p key={index}>{rivi}</p>
            })}
          </div>
        )}
      </div>
      {user && intro ? (
        <div className='edit'>
          <form onSubmit={handleUpdateIntro}>
            <label htmlFor='intro'>
              {teksti[0] !== '' ? 'Muokkaa esittelytekstiä:' : 'Lisää esittelyteksti:'}
            </label>
            <textarea
              name='intro'
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
            />
            <button type='submit'>Tallenna</button>
          </form>
          {/* <button onClick={handleDeleteIntro}>Delete</button> */}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Intro
