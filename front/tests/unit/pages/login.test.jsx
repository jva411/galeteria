/* eslint-disable no-undef */
import React from 'react'
import Login from '../../../pages/login'
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

describe('unit tests of page \'login\'', () => {

    test('should render lenovo logo', () => {
        render(<Login />)

        expect(screen.getByAltText(/Lenovo Logo/iu)).toBeInTheDocument()
    })

    test('should render lenovo copyright', () => {
        render(<Login />)

        expect(screen.getByText(/© 2019-2021 Lenovo Sentiment. All rights reserved./iu))
    })

    test('should render input for username and password', () => {
        render(<Login />)

        expect(screen.getByPlaceholderText(/username/iu)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/password/iu)).toBeInTheDocument()
    })

    test('should render button to login', () => {
        render(<Login />)

        const button = screen.getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent(/login/iu)
    })

    test('should Index match with Snapshot', () => {
        const tree = renderer.create(<Login />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
