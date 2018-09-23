import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet, injectGlobal } from 'styled-components'

injectGlobal`
*{ 
    margin:0;
    padding:0;
}

html, body {
    background-color: #fff;
    color: #000;
    height:100%;
    box-sizing: border-box;
}

body {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  font-size: 18px;
  line-height: 1.4em;
  text-rendering: optimizeLegibility;
}
input,textarea{
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}
a {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
::selection {
    background-color: #000;
    color: #FFF;
}

`


export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}