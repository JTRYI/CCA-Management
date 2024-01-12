import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditModal from './editModal';

describe('EditModal Component', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Reset all mocks after each test
    });

    it('Updates form fields on user input', () => {
        // Render the EditModal
        render(<EditModal isOpen={true} onClose={() => { }} afterCloseCallback={() => { }} memberID={123} />);

        // Modify form fields
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'newemail@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'NewName' } });
        fireEvent.change(screen.getByLabelText('Instrument'), { target: { value: 'Trumpet' } });
        fireEvent.change(screen.getByLabelText('Year of Study'), { target: { value: 2 } });

        // Assertions
        expect(screen.getByLabelText('Email')).toHaveValue('newemail@gmail.com');
        expect(screen.getByLabelText('Name')).toHaveValue('NewName');
        expect(screen.getByLabelText('Instrument')).toHaveValue('Trumpet');
        expect(screen.getByLabelText('Year of Study')).toHaveValue('2');
    });

    it('Successfully Updates Member', async () => {
        // Mocking the API response for updating member data
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ message: 'Member Updated Successfully!' }),
        });

        // Render the EditModal
        render(<EditModal isOpen={true} onClose={() => { }} afterCloseCallback={() => { }} memberID={123} />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'newemail@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'NewName' } });
        fireEvent.change(screen.getByLabelText('Instrument'), { target: { value: 'Trumpet' } });
        fireEvent.change(screen.getByLabelText('Year of Study'), { target: { value: 2 } });

        // Simulate form submission
        userEvent.click(screen.getByText('Update'));

        // Wait for the API response to be processed
        await waitFor(() => {
            // Check if the expectations inside global.fetch are met
            expect(global.fetch).toHaveBeenCalled();
        });

        // Assertions
        const response = await global.fetch.mock.results[0].value; // Extract the entire response
        const jsonResponse = await response.json(); // Extract the JSON response
        // console.log(jsonResponse);
        expect(jsonResponse.message).toBe('Member Updated Successfully!');
    });

    
});