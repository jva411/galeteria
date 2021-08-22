import React from 'react';
import Head from 'next/head';
import Header from './header';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

export default function Layout({ title, children }) {
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
                    margin: '0px'
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
            <Header />
            {children}
        </ChakraProvider>
    );
}