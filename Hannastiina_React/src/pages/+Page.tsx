import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import App from '../App'
import store from '../store'

import '../css/index.css'
import '../css/form.css'

export default function Page(_props: { pageContext?: { urlPathname?: string } }) {
  return (
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  )
}
