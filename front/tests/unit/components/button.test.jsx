/* eslint-disable no-undef */
import React from 'react'
import renderer from 'react-test-renderer'
import Button from '../../../components/button'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

describe('unit test of component \'button\'', () => {
    const child = 'button-text'

    test('should receive type passed', () => {
        render(<Button type='submit'>{child}</Button>)
        
        expect(screen.getByRole('button')).toHaveProperty('type', 'submit')
    })

    test('should call onClick on click event', () => {
        const handleClick = jest.fn()

        render(<Button onClick={handleClick}>{child}</Button>)
        
        userEvent.click(screen.getByRole('button'))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should Button match with Snapshot', () => {
        const tree = renderer.create(<Button type='submit'>{child}</Button>).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
