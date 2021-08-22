/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Header from '../../../../components/header/header';

describe('unit test of component \'header\'', () => {
    const handleLogout = jest.fn()
    afterEach(() => handleLogout.mockClear())

    const mockProps = {
        user: {
            role: 'ADMIN',
            username: 'Admin',
        },
        handleLogout: handleLogout
    }

    test('should render the username passed', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByText(mockProps.user.username)).toBeInTheDocument()
    })

    test('should render the role passed', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByText(mockProps.user.role)).toBeInTheDocument()
    })

    test('should render Avatar icon', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByRole('img')).toBeInTheDocument()
    })

    test('should render notifications icon button when not pass hideNotifications prop', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByRole('button', { name: /notifications/iu })).toBeInTheDocument()
    })

    test('should not render notifications icon button when pass hideNotifications prop', () => {
        render(<Header {...mockProps} hideNotifications />)

        expect(screen.queryByRole('button', { name: /notifications/iu })).not.toBeInTheDocument()
    })

    test('should render menu button', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByRole('button', { name: /menu-button/iu })).toBeInTheDocument()
    })

    test('should not show menu list when the menu button wasn\'t clicked', () => {
        render(<Header {...mockProps} />)

        expect(screen.getByText(/logout/iu).parentElement.parentElement.style.visibility).toBe('hidden')
    })

    test('should show menu list when the menu button was clicked', () => {
        render(<Header {...mockProps} />)

        const button = screen.getByRole('button', { name: /menu.*button/iu })
        userEvent.click(button)

        expect(screen.getByText(/logout/iu).parentElement.parentElement.style.visibility).toBe('visible')
    })

    test('should call handle logout when logout button is clicked', () => {
        render(<Header {...mockProps} />)

        const logout = screen.getByText(/logout/iu)
        userEvent.click(logout)

        expect(logout).not.toBeVisible()
    })

    test('should Header match with Snapshot', () => {
        const tree = renderer.create(<Header {...mockProps} />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
