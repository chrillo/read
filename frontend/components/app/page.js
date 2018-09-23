import Head from 'next/head'
import React from 'react'

export const Page = ({children,title = 'title'}) => (
  <div className="page">
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
    </Head>
    {children}
  </div>
)