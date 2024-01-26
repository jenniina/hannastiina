import {
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
  JSXElementConstructor,
  ReactElement,
  ReactPortal,
  useEffect,
} from 'react'
import './css/Accordion.css'

interface accordionProps {
  text: string
  id: string
  className: string
  children?:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactPortal
    | null
    | undefined
  isOpen?: boolean
  setIsFormOpen?: (isFormOpen: boolean) => void
  onClick?: () => void
  hideBrackets?: boolean
}

const Accordion = forwardRef((props: accordionProps, ref: Ref<unknown> | undefined) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(props.isOpen || false)
    if (props.setIsFormOpen) {
      props.setIsFormOpen(props.isOpen || false)
    }
  }, [props.isOpen])

  useEffect(() => {
    if (visible) props.onClick && props.onClick()
  }, [visible])

  const toggleVisibility = () => {
    setVisible(!visible)
    if (props.setIsFormOpen) {
      props.setIsFormOpen(!visible)
    }
    const anchor = document.querySelector(`#${props.className}-container`)
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div
      id={`${props.id}-container`}
      className={`${visible ? 'open' : 'closed'} ${
        props.className
      }-container accordion-container`}
    >
      <button
        type='button'
        className='accordion-btn open'
        onClick={toggleVisibility}
        style={visible ? { display: 'none' } : { display: 'inline-block' }}
      >
        <span aria-hidden='true' className={props.hideBrackets ? 'hide' : ''}>
          &raquo;
        </span>
        {props.text}
        <span aria-hidden='true' className={props.hideBrackets ? 'hide' : ''}>
          &laquo;
        </span>
      </button>

      <div
        className={`accordion-inner ${props.className}`}
        style={visible ? { display: 'block' } : { display: 'none' }}
      >
        <button type='button' className='accordion-btn close' onClick={toggleVisibility}>
          Sulje
        </button>

        {props.children}

        <button type='button' className='accordion-btn close' onClick={toggleVisibility}>
          Sulje
        </button>
      </div>
    </div>
  )
})

export default Accordion
