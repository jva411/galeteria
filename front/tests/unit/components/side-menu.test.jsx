/* eslint-disable no-undef */
import React from 'react'
import renderer from 'react-test-renderer'
import SideMenu from '../../../components/side-menu'
import { render, screen } from '@testing-library/react'

import * as nextRouter from 'next/router';

/* eslint-disable no-import-assign */
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ pathname: '/' }));

describe('unit test of component \'side-menu\'', () => {

    test('should render logo images to control via css', () => {
        render(<SideMenu/>)

        expect(screen.getByTitle('logo-lenovo1')).toBeInTheDocument()
        expect(screen.getByTitle('logo-lenovo2')).toBeInTheDocument()
    })

    test('should render dashboard link with proper href location already being clicked', () => {
        render(<SideMenu/>)

        expect(screen.getByText(/dashboard/iu).getAttribute('href')).toBe(null)
    })

    test('should render models link with proper href location', () => {
        render(<SideMenu/>)

        expect(screen.getByText(/models/iu).getAttribute('href')).toBe('/models')
    })

    test('should render datasets link with proper href location', () => {
        render(<SideMenu/>)

        expect(screen.getByText(/datasets/iu).getAttribute('href')).toBe('/datasets')
    })

    test('should render users link with proper href location', () => {
        render(<SideMenu/>)

        expect(screen.getByText(/users/iu).getAttribute('href')).toBe('/users')
    })

    test('should render groups link with proper href location', () => {
        render(<SideMenu/>)

        expect(screen.getByText(/groups/iu).getAttribute('href')).toBe('/groups')
    })

    test('should SideMenu match with Snapshot', () => {
        const tree = renderer.create(<SideMenu/>).toJSON()

        expect(tree).toMatchSnapshot()
    })
})