/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import Input from '~/components/inputs/password-input';
import { render, screen } from '@testing-library/react';

describe('unit tests of component \'password-input\'', () => {
    const mockProps = {
        id: 'id',
        name: 'name',
        placeholder: 'placeholder',
    }

    test('should use LabeledInput component as input', () => {
        render(<Input {...mockProps} />);

        const input = screen.getByPlaceholderText(mockProps.placeholder);

        expect(input.parentElement).toHaveClass('labeled-input-div');
    })

    test('should hide password by default', () => {
        render(<Input {...mockProps} />);

        const input = screen.getByPlaceholderText(mockProps.placeholder);

        expect(input).toHaveProperty('type', 'password');
        expect(screen.queryByRole('textbox')).toBeNull();
    })

    test('should show password as text when click to show on icon', () => {
        render(<Input {...mockProps} />);

        const input = screen.getByPlaceholderText(mockProps.placeholder);
        const icon = screen.getByTitle(`${mockProps.id}-title`);
        userEvent.click(icon);

        expect(input).toHaveProperty('type', 'text');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    })

    test('should Password Input match with Snapshot', () => {
        const tree = renderer.create(<Input {...mockProps} onChange={() => {
            // do nothing
        }} />).toJSON();

        expect(tree).toMatchSnapshot();
    })
})
