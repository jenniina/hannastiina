import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import Page from './+Page'

type OnRenderHtmlReturn = {
  documentHtml: ReturnType<typeof escapeInject>
}

export const onRenderHtml = (
  pageContext: PageContextServer
): OnRenderHtmlReturn => {
  const helmetContext: any = {}

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <Page pageContext={pageContext} />
    </HelmetProvider>
  )

  const helmet = helmetContext.helmet
  const helmetHead = helmet
    ? dangerouslySkipEscape(
        [
          helmet.title?.toString(),
          helmet.priority?.toString?.(),
          helmet.meta?.toString(),
          helmet.link?.toString(),
          helmet.script?.toString(),
          helmet.noscript?.toString(),
          helmet.style?.toString(),
        ]
          .filter(Boolean)
          .join('\n')
      )
    : ''

  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="icon" type="" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

    <link
      rel="stylesheet"
      type="text/css"
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;1,100;1,300;1,400;1,700&display=swap"
    />

    ${helmetHead}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`

  return { documentHtml }
}
