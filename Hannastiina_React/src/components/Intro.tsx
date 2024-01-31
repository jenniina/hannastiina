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
    try {
      await dispatch(
        updateIntro({
          id: intro?.esittely?.[0]?.id as number,
          newObject: { esittely: introText, viimeisinMuokkaus: user?.id as number },
        })
      )
        .then((result) => {
          if (result.type === 'intro/updateIntro/rejected') {
            if ('payload' in result && result.payload !== undefined) {
              dispatch(notify(`${result.payload}`, true, 8))
            }
          } else dispatch(notify('Esittely päivitetty', false, 3))
        })
        .catch((e) => {
          console.error(e)
          dispatch(
            notify(
              `Virhe! ${e?.response?.data?.message ?? (e as Error)?.message}`,
              true,
              8
            )
          )
        })
    } catch (e: any) {
      console.error(e)
      dispatch(
        notify(`Virhe! ${e?.response?.data?.message ?? (e as Error)?.message}`, true, 8)
      )
    }
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
              {teksti[0].trim() !== ''
                ? 'Muokkaa esittelytekstiä:'
                : 'Lisää esittelyteksti:'}
            </label>
            <textarea
              name='intro'
              rows={5}
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
