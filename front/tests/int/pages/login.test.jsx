/* eslint-disable no-undef */
/* eslint-disable prefer-promise-reject-errors */
import React from 'react'
import axios from 'axios'
import Router from 'next/router'
import Login from '../../../pages/login'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('next/router')
Router.push = jest.fn()
afterEach(() => {
    Router.push.mockClear()
})

describe('integration tests of page \'login\'', () => {
    test('should successfully login when receive 200 from api', async () => {
        render(<Login />)

        axios.post.mockImplementationOnce(() => Promise.resolve({status: 200}))

        const username = screen.getByRole('textbox')
        const password = screen.getByPlaceholderText(/password/iu)
        const submit = screen.getByRole('button')

        userEvent.type(username, 'username')
        userEvent.type(password, '123')
        userEvent.click(submit)

        await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/'))
    })

    test('should fail login when receive 400 from api', async () => {
        render(<Login />)

        axios.post.mockImplementationOnce(() => Promise.reject({response: {status: 400}}))

        const username = screen.getByRole('textbox')
        const password = screen.getByPlaceholderText(/password/iu)
        const submit = screen.getByRole('button')

        userEvent.type(username, 'username')
        userEvent.type(password, '123')
        userEvent.click(submit)

        expect(await screen.findByText(/Invalid username or password/iu)).toBeInTheDocument()
    })

    test('should show login attempts exceeded when receive 423 from api', async () => {
        render(<Login />)

        axios.post.mockImplementationOnce(() => Promise.reject({response: {status: 423}}))

        const username = screen.getByRole('textbox')
        const password = screen.getByPlaceholderText(/password/iu)
        const submit = screen.getByRole('button')

        userEvent.type(username, 'username')
        userEvent.type(password, '123')
        userEvent.click(submit)

        expect(await screen.findByText(/Login attempts exceeded/iu)).toBeInTheDocument()
        expect(await screen.findByText(/Try again in a few moments/iu)).toBeInTheDocument()
    })

    test('should show login attempts exceeded when receive 429 from api', async () => {
        render(<Login />)

        axios.post.mockImplementationOnce(() => Promise.reject({response: {status: 423}}))

        const username = screen.getByRole('textbox')
        const password = screen.getByPlaceholderText(/password/iu)
        const submit = screen.getByRole('button')

        userEvent.type(username, 'username')
        userEvent.type(password, '123')
        userEvent.click(submit)

        expect(await screen.findByText(/Login attempts exceeded/iu)).toBeInTheDocument()
        expect(await screen.findByText(/Try again in a few moments/iu)).toBeInTheDocument()
    })

    test('should require username when submit with empty username', async () => {
        render(<Login />)

        const password = screen.getByPlaceholderText(/password/iu)
        const submit = screen.getByRole('button')

        userEvent.type(password, '123')
        userEvent.click(submit)
        expect(await screen.findByText(/please, enter a username/iu)).toBeInTheDocument()
    })

    test('should require password when submit with empty password', async () => {
        render(<Login />)

        const username = screen.getByRole('textbox')
        const submit = screen.getByRole('button')

        userEvent.type(username, 'username')
        userEvent.click(submit)
        expect(await screen.findByText(/please, enter a password/iu)).toBeInTheDocument()
    })
})
