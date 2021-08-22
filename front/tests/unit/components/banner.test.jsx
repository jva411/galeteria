/* eslint-disable no-undef */
import React from 'react'
import renderer from 'react-test-renderer'
import Banner from '../../../components/banner'
import { render, screen, cleanup } from '@testing-library/react'

jest.mock('next/router', () => ({
    useRouter() {
        return { pathname: '/'};
    },
}));

afterEach(cleanup)

describe('unit tests of component Banner', () => {
    test('should render text', () => {
        render(<Banner />)

        expect(screen.getByText(/Lenovo Internal Use Only/iu)).toBeInTheDocument()
    })

    test('should Banner match with Snapshot', () => {
        const tree = renderer.create(<Banner />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
