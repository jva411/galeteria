/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import React from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import Notifications from '../../../../components/header/notifications';

describe('integration tests of component \'notification\'', () => {
    const getNotifications = () => ({
        datasets: {
            data: [
                {
                    message: 'Dataset not found.',
                    name: '70d4b5d8-080d-4bd5-b05a-ed83f7943b61',
                    operation: 'GET',
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
                    request_time: DateTime.fromMillis(Date.parse('2020-10-20 16:11:35.254000-03:00')),
                    status: 'SUCCESS'
                }
            ],
            seen: true
        }
    })


    test('should clear models notifications when click to clear and receive 200 from api', async () => {
        const notif = getNotifications()
        const promise = Promise.resolve({
            status: 200
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        await act(() => promise)
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))

        expect(notif.models.data.length).toBe(0)
        expect(screen.getByText(/no notifications/iu)).toBeInTheDocument()
        expect(axios.delete).toHaveBeenLastCalledWith('/notifications/models')
    })

    test('should not clear models notifications when click to clear and not receive 200 from api', () => {
        const notif = getNotifications()
        const promise = Promise.reject({
            response: {
                status: 400
            }
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))

        expect(notif.models.data.length).toBe(1)
        expect(screen.queryByText(/no notifications/iu)).toBeNull()
        expect(axios.delete).toHaveBeenLastCalledWith('/notifications/models')
    })

    test('should clear datasets notifications when click to clear and receive 200 from api', async () => {
        const notif = getNotifications()
        const promise = Promise.resolve({
            status: 200
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        await act(() => promise)
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))

        expect(notif.datasets.data.length).toBe(0)
        expect(screen.getByText(/no notifications/iu)).toBeInTheDocument()
        expect(axios.delete).toHaveBeenCalledWith('/notifications/datasets')
    })

    test('should not clear datasets notifications when click to clear and not receive 200 from api', () => {
        const notif = getNotifications()
        const promise = Promise.reject({
            response: {
                status: 400
            }
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /datasets/iu}))

        expect(notif.models.data.length).toBe(1)
        expect(screen.queryByText(/no notifications/iu)).toBeNull()
        expect(axios.delete).toHaveBeenLastCalledWith('/notifications/datasets')
    })

    test('should clear users notifications when click to clear and receive 200 from api', async () => {
        const notif = getNotifications()
        const promise = Promise.resolve({
            status: 200
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))

        userEvent.click(screen.getByRole('tab', {name: /users/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        await act(() => promise)
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /users/iu}))

        expect(notif.users.data.length).toBe(0)
        expect(screen.getByText(/no notifications/iu)).toBeInTheDocument()
        expect(axios.delete).toHaveBeenCalledWith('/notifications/users')
    })

    test('should not clear users notifications when click to clear and not receive 200 from api', () => {
        const notif = getNotifications()
        const promise = Promise.reject({
            response: {
                status: 400
            }
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /users/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /users/iu}))

        expect(notif.models.data.length).toBe(1)
        expect(screen.queryByText(/no notifications/iu)).toBeNull()
        expect(axios.delete).toHaveBeenLastCalledWith('/notifications/users')
    })

    test('should clear groups notifications when click to clear and receive 200 from api', async () => {
        const notif = getNotifications()
        const promise = Promise.resolve({
            status: 200
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        await act(() => promise)
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))

        expect(notif.groups.data.length).toBe(0)
        expect(screen.getByText(/no notifications/iu)).toBeInTheDocument()
        expect(axios.delete).toHaveBeenCalledWith('/notifications/groups')
    })

    test('should not clear groups notifications when click to clear and not receive 200 from api', () => {
        const notif = getNotifications()
        const promise = Promise.reject({
            response: {
                status: 400
            }
        })
        axios.delete = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))
        userEvent.click(screen.getByText(/clear all notifications/iu))
        userEvent.click(screen.getByRole('tab', {name: /models/iu}))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))

        expect(notif.models.data.length).toBe(1)
        expect(screen.queryByText(/no notifications/iu)).toBeNull()
        expect(axios.delete).toHaveBeenLastCalledWith('/notifications/groups')
    })

    test('should update hidden prop when see a notification and receive 200 from api', async () => {
        const notif = getNotifications()
        notif.models.seen = false
        const promise = Promise.resolve({
            status: 200
        })
        axios.patch = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))
        await act(() => promise)

        expect(notif.models.seen).toBeTruthy()
        expect(axios.patch).toHaveBeenLastCalledWith('/notifications/models', {seen: true})
    })

    test('should not update hidden prop when see a notification and not receive 200 from api', () => {
        const notif = getNotifications()
        notif.models.seen = false
        const promise = Promise.reject({
            response: {
                status: 400
            }
        })
        axios.patch = jest.fn(() => promise)

        render(<Notifications notifications={notif} />)

        userEvent.click(screen.getByRole('button'))
        userEvent.click(screen.getByRole('tab', {name: /groups/iu}))

        expect(notif.models.seen).toBeFalsy()
        expect(axios.patch).toHaveBeenLastCalledWith('/notifications/models', {seen: true})
    })
    
})
