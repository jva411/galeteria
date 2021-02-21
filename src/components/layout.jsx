import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';

import SEO from '../components/seo';
import Header from '../components/header';
import Footer from '../components/footer';

export default ({ children }) => (
  <ChakraProvider>
    <CSSReset />
    <SEO title="Home" />

    <Header />
        {children}
    <Footer />
  </ChakraProvider>
);

