import { hydrateRoot, type Root } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import Page from './+Page'

let root: Root | null = null

export { onRenderClient }

function onRenderClient(pageContext: any) {
  const container = document.getElementById('root')
  if (!container) throw new Error('Missing #root element')

  const reactTree = (
    <HelmetProvider>
      <Page pageContext={pageContext} />
    </HelmetProvider>
  )

  if (!root) {
    root = hydrateRoot(container, reactTree, {
      onRecoverableError: (error) => {
        // eslint-disable-next-line no-console
        console.error('[React recoverable error]', error)
      },
    })
  } else {
    root.render(reactTree)
  }
}
