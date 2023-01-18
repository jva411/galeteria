import Head from 'next/head'
import '/styles/globals.scss'
import { AppProps } from 'next/app'
import Header from 'components/header'


export default function App({ Component, pageProps }: AppProps) {
  const { title } = pageProps

  return <>
    <Head>
      <title>{title || 'Disk Frango Real'}</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <div className='min-w-screen min-h-screen pt-[5rem]'>
      <Component {...pageProps} />
    </div>
  </>
}
