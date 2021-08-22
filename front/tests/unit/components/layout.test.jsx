/* eslint-disable no-undef */
import React from 'react'
import renderer from 'react-test-renderer'
import Layout from '../../../components/layout'
import { render, screen, cleanup } from '@testing-library/react'
import { Box, Heading, Text } from '@chakra-ui/layout'

jest.mock('next/router', () => ({
    useRouter() {
        return { pathname: '/'};
    },
}));

afterEach(cleanup)

describe('unit tests of component Layout', () => {
    const mockProps = {
        title: 'test-title',
        children:
            <Box>
                <Heading as='h1'>Hello Jest!</Heading>
                <Text>something</Text>
            </Box>
    }

    test('should render children', () => {
        render(<Layout {...mockProps} />)

        expect(screen.getByText(/Hello Jest/iu)).toBeInTheDocument()
        expect(screen.getByText(/something/iu)).toBeInTheDocument()
    })

    test('should always render Banner', () => {
        render(<Layout />)

        expect(screen.getByText(/Lenovo Internal Use Only/iu)).toBeInTheDocument()
    })

    test('should render Header when not pass hideMenus prop', () => {
        render(<Layout />)

        expect(screen.getByText(/Lenovo Internal Use Only/iu)).toBeInTheDocument()
    })

    test('should not render Header when pass hideMenus prop', () => {
        render(<Layout {...mockProps} hideMenus />)

        expect(screen.queryByText(/username/iu)).not.toBeInTheDocument()
        expect(screen.queryByText(/role/iu)).not.toBeInTheDocument()
    })

    test('should Layout match with Snapshot', () => {
        const tree = renderer.create(<Layout {...mockProps} />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
