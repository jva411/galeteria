/* eslint-disable no-undef */
import React from 'react'
import renderer from 'react-test-renderer'
import userEvent from '@testing-library/user-event'
import Input from '~/components/inputs/labeled-input'
import { render, screen } from '@testing-library/react'

describe('unit tests of component \'labeled-input\'', () => {
    const mockProps = {
        id: 'id',
        name: 'name',
        label: 'label',
        placeholder: 'placeholder',
    }
    const error = 'invalid_input'

    test('should call onChange on input event', () => {
        const handleChange = jest.fn()
        render(<Input {...mockProps} onChange={handleChange} />)

        const input = screen.getByRole('textbox')
        userEvent.type(input, 'username')

        expect(handleChange).toBeCalledTimes(8)
    })

    test('should use the placehold passed as prop', () => {
        render(<Input {...mockProps} />)

        expect(screen.getByPlaceholderText(mockProps.placeholder)).toBeInTheDocument()
    })

    test('should use the type passed as prop', () => {
        render(<Input {...mockProps} type='search' />)

        expect(screen.getByPlaceholderText(mockProps.placeholder)).toHaveProperty('type', 'search')
    })

    test('should use the value passed as prop', () => {
        const handleChange = jest.fn()
        render(<Input {...mockProps} value='someValue' onChange={handleChange} />)

        expect(screen.getByPlaceholderText(mockProps.placeholder)).toHaveProperty('value', 'someValue')
    })

    test('should use the name passed as prop', () => {
        render(<Input {...mockProps} />)

        expect(screen.getByPlaceholderText(mockProps.placeholder)).toHaveProperty('name', mockProps.name)
    })

    test('should use the id passed as prop', () => {
        render(<Input {...mockProps} />)

        expect(screen.getByPlaceholderText(mockProps.placeholder)).toHaveProperty('id', mockProps.id)
    })

    test('should use the label passed as prop', () => {
        render(<Input {...mockProps} label='label' />)

        const label = screen.getByText('label')

        expect(label).toBeInTheDocument()
        expect(label.nodeName).toMatch(/label/iu)
    })

    test('should limit input lenght when maxLenght prop is passed', () => {
        render(<Input {...mockProps} maxLength={10} />)

        const input = screen.getByRole('textbox')
        userEvent.type(input, '0123456789abcde')

        expect(input.value).toBe('0123456789')
    })

    test('should label has \'for\' attribute link with input', () => {
        render(<Input {...mockProps} label='label' />)

        const label = screen.getByText('label')

        expect(label).toHaveAttribute('for', mockProps.name)
    })

    test('should render the children', () => {
        render(<Input {...mockProps}>
            <div>
                <span>something</span>
            </div>
        </Input>)

        expect(screen.getByText('something')).toBeInTheDocument()
    })

    test('should show error message when receive a non empty errors prop', () => {
        render(<Input {...mockProps} errors={error} />)

        expect(screen.getByText(error)).toBeInTheDocument()
    })

    test('should Labeled Input match with Snapshot', () => {
        const tree = renderer.create(<Input {...mockProps} onChange={() => {
            // do nothing
        }} />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})
