/* eslint-disable no-undef */
import React from 'react';
import { DateTime } from 'luxon';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Notifications from '../../../../components/header/notifications';

describe('unit tests of component \'notification\'', () => {
    const mockProps = {
        notifications: {
            datasets: {
                data: [
                    {
                        message: 'Dataset not found.',
                        name: '70d4b5d8-080d-4bd5-b05a-ed83f7943b61',
                        operation: 'GET',
                        /* eslint-disable camelcase */
                        request_time: DateTime.fromMillis(Date.parse('2020-10-21 16:14:43.981000-03:00')),
                        status: 'WARNING'
                    }
                ],
                seen: true
            },
            models: {
                data: [
                    {
                        message: 'Model not found.',
                        name: 'ce06865f-6673-4b8d-b423-2a2e7faa01b6',
                        operation: 'GET',
                        /* eslint-disable camelcase */
                        request_time: DateTime.fromMillis(Date.parse('2020-10-21 16:14:45.457000-03:00')),
                        status: 'INFO'
                    }
                ],
                seen: true
            },
            users: {
                data: [
                    {
                        message: 'User can not be deleted. Try again later.',
                        name: 'BalEjpTdgOyXjqJiqcfg',
                        operation: 'DELETE',
                        /* eslint-disable camelcase */
                        request_time: DateTime.fromMillis(Date.parse('2020-10-21 16:14:42.537000-03:00')),
                        status: 'ERROR'
                    }
                ],
                seen: true
            },
            groups: {
                data: [
                    {
                        message: 'Group can not be deleted. Try again later.',
                        name: 'GroupName',
                        operation: 'DELETE',
                        /* eslint-disable camelcase */
                        request_time: DateTime.fromMillis(Date.parse('2020-10-20 16:11:35.254000-03:00')),
                        status: 'SUCCESS'
                    }
                ],
                seen: true
            }
        }
    }

    test('should render notifications button', () => {
        render(<Notifications />)

        const button = screen.getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('title', 'notifications')
    })

    test('should hidde tabs when button is not clicked', () => {
        render(<Notifications />)

        expect(screen.getByTestId('popover-content').style).toHaveProperty('visibility', 'hidden')
    })

    test('should show tabs when button is clicked', () => {
        render(<Notifications />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.getByTestId('popover-content').style).toHaveProperty('visibility', 'visible')
    })

    test('should not render the tabs when popover is not open', () => {
        render(<Notifications />)

        expect(screen.queryByText(/models/iu)).toBeNull()
        expect(screen.queryByText(/datasets/iu)).toBeNull()
        expect(screen.queryByText(/users/iu)).toBeNull()
        expect(screen.queryByText(/groups/iu)).toBeNull()
    })

    test('should render 4 tabs when popover is open', () => {
        render(<Notifications />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.getByText(/models/iu)).toBeInTheDocument()
        expect(screen.getByText(/datasets/iu)).toBeInTheDocument()
        expect(screen.getByText(/users/iu)).toBeInTheDocument()
        expect(screen.getByText(/groups/iu)).toBeInTheDocument()
    })

    test('should render \'No notifications\' when not have notifications', () => {
        render(<Notifications />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.getByText(/no notifications/iu)).toBeInTheDocument()
    })

    test('should not render \'No notifications\' when have notifications', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.queryByText(/no notifications/iu)).toBeNull()
    })

    test('should render \'Clear all notifications\' when have notifications', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.getByText(/clear all notifications/iu)).toBeInTheDocument()
    })

    test('should not render \'Clear all notifications\' when not have notifications', () => {
        render(<Notifications />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.queryByText(/clear all notifications/iu)).toBeNull()
    })

    test('should hidde red highlight when all notications have been seen', () => {
        render(<Notifications {...mockProps} />)

        expect(screen.getByTestId('notification-highlight')).not.toBeVisible()
    })

    test('should show red highlight when there is a notication that has not been seen', () => {
        mockProps.notifications.datasets.seen = false
        render(<Notifications {...mockProps} />)

        expect(screen.getByTestId('notification-highlight')).toBeVisible()
        mockProps.notifications.datasets.seen = true
    })

    test('should render models notifications when models tab is selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.getByText(/Model not found/iu)).toBeInTheDocument()
    })

    test('should not render models notifications when models tab is not selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', { name: /datasets/iu }))

        expect(screen.queryByText(/Model not found/iu)).toBeNull()
    })

    test('should render datasets notifications when datasets tab is selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', { name: /datasets/iu }))

        expect(screen.getByText(/Dataset not found/iu)).toBeInTheDocument()
    })

    test('should not render datasets notifications when datasets tab is not selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.queryByText(/Dataset not found/iu)).toBeNull()
    })

    test('should render users notifications when users tab is selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', { name: /users/iu }))

        expect(screen.getByText(/user can not be deleted/iu)).toBeInTheDocument()
    })

    test('should not render users notifications when users tab is not selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.queryByText(/user can not be deleted/iu)).toBeNull()
    })

    test('should render groups notifications when groups tab is selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', { name: /groups/iu }))

        expect(screen.getByText(/group can not be deleted/iu)).toBeInTheDocument()
    })

    test('should not render groups notifications when groups tab is not selected', () => {
        render(<Notifications {...mockProps} />)

        userEvent.click(screen.getByRole('button'))

        expect(screen.queryByText(/group can not be deleted/iu)).toBeNull()
    })

    test('should Notifications match with Snapshot', () => {
        const tree = renderer.create(<Notifications />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
