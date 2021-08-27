import React from 'react';
import Head from 'next/head';
import Header from './header';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

export default function Layout({ title, children, hideMenus }) {
    const theme = extendTheme({
        colors: {
            green: '#1DCC0E'
        },
        shadows: {
            outline: 'none'
        },
        styles: {
            global: {
                body: {
                    margin: '0rem'
                }
            }
        }
    });

    return (
        <ChakraProvider theme={theme} resetCSS={false}>
            <ColorModeScript />
            <Head>
                <title>{title}</title>
            </Head>
            {hideMenus ? <></> : <Header />}
            {children}
        </ChakraProvider>
    );
}
