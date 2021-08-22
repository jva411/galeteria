import '~/styles/globals.css'
import 'rsuite/lib/styles/index.less'
import Layout from '~/components/layout'
import GlobalContextProvider from '~/lib/globalContext'
import ContextMenu from '~/components/context-menu'

function MyApp({ Component, pageProps }) {
    return (
        <GlobalContextProvider>
            <Layout {...pageProps}>
                <Component {...pageProps} />
            </Layout>
            <ContextMenu />
        </GlobalContextProvider>
    )
}

export default MyApp
