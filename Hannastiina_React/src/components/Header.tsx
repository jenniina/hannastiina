import { GiComb } from 'react-icons/gi'
import { FaPhoneAlt } from 'react-icons/fa'
import img from '../assets/Hannastiina.png'
import { IUser, RefObject } from '../types'
import useEnterDirection from '../hooks/useEnterDirection'
import styles from './css/Header.module.css'
import { FC, createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useRandomMinMax from '../hooks/useRandomMinMax'
import useIsWithinBounds from '../hooks/useIsWithinBounds'

interface Props {
  user: IUser | null
  handleScrollToElement: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void
  windowWidth: number
  windowHeight: number
}
type itemProps = {
  i: number
  e: number
  size: number
  color: string
}

const Header = ({ user, handleScrollToElement, windowWidth, windowHeight }: Props) => {
  const color = 'white'
  const initialAmount = 8
  const [amount, setAmount] = useState<number>(initialAmount)
  const [values, setValues] = useState<itemProps[]>([
    { i: 1, e: 9.274, size: 10, color: color },
    { i: 2, e: 5.044, size: 11, color: color },
    { i: 3, e: 7.886, size: 9, color: color },
    { i: 4, e: 4.966, size: 6, color: color },
    { i: 5, e: 6.621, size: 9, color: color },
    { i: 6, e: 8.489, size: 6, color: color },
    { i: 7, e: 7.79, size: 11, color: color },
    { i: 8, e: 8.365, size: 4, color: color },
    { i: 9, e: 7.846, size: 6, color: color },
    { i: 10, e: 4.121, size: 8, color: color },
  ])

  const isTouchDevice = () => {
    try {
      //Try to create TouchEvent (fails for desktops and throws error)
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  }

  const touchDevice = isTouchDevice()

  const ulRef = useRef() as RefObject<HTMLUListElement>
  const itemRefs = useRef<React.RefObject<HTMLLIElement>[]>([])
  const targetRef = useRef<HTMLElement | null>(null)
  const [currentTarget, setCurrentTarget] = useState<HTMLElement | null>(null)
  const resetButton = useRef() as RefObject<HTMLButtonElement>
  const imgRef = useRef() as RefObject<HTMLDivElement>
  const [viewportChanged, setViewportChanged] = useState(false)
  const isWithinBounds = useIsWithinBounds(targetRef, ulRef)

  useEffect(() => {
    if (currentTarget && !isWithinBounds) {
      currentTarget.tabIndex = -1
    }
  }, [isWithinBounds, currentTarget])

  const removeWithTouch = (e: TouchEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).classList.add(styles.exitItem)
    setTimeout(() => {
      ;(e.target as HTMLElement).remove()
    }, 1000)
  }

  const removeItem = (element: HTMLElement) => {
    if (!touchDevice) {
      //if not a touch device, remove item
      element.classList.add(styles.exitItem)
      setTimeout(() => {
        element.remove()
      }, 1000)
    } else {
      //if a touch device, activate animation on tap
      element.classList.add(styles.active)
      element.addEventListener('blur', () => {
        element.classList.remove(styles.active)
        element.removeEventListener('touchend', removeWithTouch)
      })
      setTimeout(() => {
        element.addEventListener('touchend', removeWithTouch) //remove item on second tap
      }, 100)
    }
  }
  const handleReset = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    windowWidth < 600 && amount === 4
      ? setAmount(5)
      : windowWidth < 600
      ? setAmount(4)
      : windowWidth >= 600 && amount === initialAmount
      ? setAmount(initialAmount + 1)
      : setAmount(initialAmount)
  }

  const handleFocus = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault()
    const anchor: HTMLButtonElement | null = document.querySelector(`#${id}`)
    if (anchor) {
      anchor.focus()
    }
  }

  const setupItems: itemProps[] = useMemo(() => {
    for (let i: number = 0; i <= amount; i++) {
      const item: itemProps = {
        i: i,
        e: useRandomMinMax(5, 10),
        size: Math.round(useRandomMinMax(3, 13)),
        color: color,
      }
      if (i == 0) {
        setValues([])
      } else {
        setValues((prev) => {
          return [...prev, item]
        })
      }
    }
    return values
  }, [amount])

  useEffect(() => {
    windowWidth < 600 ? setAmount(4) : ''
  }, [windowWidth])

  const movingItem = (e: React.PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    targetRef.current = target
    setCurrentTarget(target)
    const targetRight = window.getComputedStyle(target).getPropertyValue('right')
    const targetTop = window.getComputedStyle(target).getPropertyValue('top')
    const from = useEnterDirection(e)
    switch (from) {
      case 'top':
        target.style.top = `${parseFloat(targetTop) + 20}px`
        break
      case 'right':
        target.style.right = `${parseFloat(targetRight) + 20}px`
        break
      case 'bottom':
        target.style.top = `${parseFloat(targetTop) - 20}px`
        break
      case 'left':
        target.style.right = `${parseFloat(targetRight) - 20}px`
        break
      default:
        break
    }
  }

  //To stop the light effects from animating to their new positions when the viewport is resized:
  useEffect(() => {
    const handleResize = () => {
      setViewportChanged(true)
      setTimeout(() => setViewportChanged(false), 300)
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const ItemComponent: FC<{ array: itemProps[] }> = useCallback(
    ({ array }) => {
      {
        return (
          <ul
            ref={ulRef}
            id={`listbox`}
            role='listbox'
            aria-labelledby={`description`}
            aria-activedescendant=''
            className={`${styles.herocontent} ${viewportChanged ? 'disable' : ''}`}
          >
            {array.map((item, index: number) => {
              const style: React.CSSProperties = {
                position: 'absolute',
                top:
                  windowWidth > 600
                    ? `clamp(10px, calc(-50px + 1.5vh * ${item.e} * ${item.e / 3}
                    / ${item.i / 2}), ${
                        ulRef.current ? ulRef.current?.offsetHeight + 'px' : '50vh'
                      })`
                    : `clamp(10px, calc(-50px + 1vw * ${item.e} * ${item.e / 3}), ${
                        ulRef.current ? ulRef.current?.offsetHeight + 'px' : '300px'
                      })`,
                right:
                  windowWidth > 600
                    ? `clamp(10px, calc(${item.i / 1.2} * 1.5vw * ${item.e}), 95vw)`
                    : `clamp(10px, calc(${item.i} * 1.5vw * ${item.e}), 95vw)`,
                backgroundColor: `transparent`,
                backgroundImage: `radial-gradient(${item.color} 0%, ${item.color} 50%, transparent 100%)`,
                color: `${item.color}`,
                ['--i' as string]: `${item.i}`,
                ['--e' as string]: `${item.e}`,
                ['--s' as string]:
                  windowWidth < windowHeight ? `${item.size}vh` : `${item.size}vw`,
                width: windowWidth < windowHeight ? `${item.size}vh` : `${item.size}vw`,
                height: windowWidth < windowHeight ? `${item.size}vh` : `${item.size}vw`,

                ['--s2' as string]: item.size,
                maxHeight: '200px',
                maxWidth: '200px',
                minHeight: '40px',
                minWidth: '40px',
                borderRadius: '65% 65% 70% 60% / 60% 70% 60% 65%',
              }

              if (!itemRefs.current[index]) {
                itemRefs.current[index] = createRef()
              }

              const isWithinBounds = useIsWithinBounds(itemRefs.current[index], ulRef)

              return (
                <li
                  key={`${index}`}
                  ref={itemRefs.current[index]}
                  className={`${styles.item}`}
                  style={style}
                  id={`item${index + 1}`}
                  role={'option'}
                  tabIndex={isWithinBounds ? 0 : -1}
                  onFocus={(e) => {
                    ulRef.current?.setAttribute('aria-activedescendant', `${e.target.id}`)
                  }}
                  onBlurCapture={() => {
                    ulRef.current?.setAttribute('aria-activedescendant', '')
                  }}
                  onPointerEnter={(e) => {
                    movingItem(e)
                  }}
                  onMouseDown={(e) => {
                    removeItem(e.target as HTMLElement)
                  }}
                  onTouchStart={(e) => {
                    removeItem(e.target as HTMLElement)
                  }}
                  onPointerDown={(e) => {
                    removeItem(e.target as HTMLElement)
                  }}
                  onKeyDown={(e) => {
                    switch (e.key) {
                      case 'Enter':
                      case 'Space':
                        removeItem(e.target as HTMLElement)
                        break
                      case 'Escape':
                        if (resetButton.current) resetButton.current.focus()
                    }
                  }}
                >
                  <span>
                    <span className='scr'>valo {index + 1}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        )
      }
    },
    [values, amount, windowWidth, windowHeight, viewportChanged]
  )

  return (
    <header>
      <nav className={`skip-links ${styles['skip-links']}`}>
        <ul>
          <li>
            <button
              onClick={(e) => handleScrollToElement(e, 'main')}
              className={`skip-link ${styles['skip-link']}`}
            >
              Siirry sisältöön
            </button>
          </li>
          <li>
            <button
              onClick={(e) => handleFocus(e, 'palvelut-link')}
              className={`skip-link ${styles['skip-link']}`}
            >
              Siirry päävalikkoon
            </button>
          </li>
          <li>
            <button
              onClick={(e) => handleScrollToElement(e, 'footer')}
              className={`skip-link ${styles['skip-link']}`}
            >
              Siirry alatunnisteeseen
            </button>
          </li>
        </ul>
      </nav>
      <nav id='nav' className={`main ${styles.main} pink ${styles.pink}`}>
        <ul>
          <li className={styles.services}>
            <button
              id='palvelut-link'
              onClick={(e) => {
                handleScrollToElement(e, 'palvelut')
              }}
            >
              <span>
                <span className={styles.icon}>
                  <GiComb />
                </span>
                <span className={styles.text}>Palvelut</span>
              </span>
            </button>
          </li>
          <li className={styles.contact}>
            <button
              onClick={(e) => {
                handleScrollToElement(e, 'yhteystiedot')
              }}
            >
              <span>
                <span className={styles.icon}>
                  <FaPhoneAlt />
                </span>
                <span className={styles.text}>Yhteystiedot</span>
              </span>
            </button>
          </li>
        </ul>
      </nav>
      <div ref={imgRef} className={styles.img}>
        <img className={styles.bg} src={img} alt='tausta' aria-hidden='true' />

        <ItemComponent array={setupItems} />

        <div className={styles.bottom}>
          <button
            data-instructions='Vinkki: klikkaa valoja poistaaksesi ne'
            className={`reset ${styles.reset}`}
            ref={resetButton}
            type='button'
            onClick={handleReset}
          >
            <span>Palauta</span>
          </button>
        </div>
      </div>

      <div className={`pink filler ${styles.pink} ${styles.filler}`}>
        {user && (
          <span>Kirjauduttu nimellä {user?.name ? user?.name : user.username} </span>
        )}
      </div>
      <h1 className={windowWidth > 250 ? 'scr' : ''}>
        Parturi Kampaamo <span>HANNASTIINA</span>
      </h1>
    </header>
  )
}

export default Header
