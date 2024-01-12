import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddModal from './AddModal';


describe('AddModal Component', () => {

  afterEach(() => {
    jest.restoreAllMocks(); // Reset all mocks after each test
  });

  it('Successfully adds a new member', async () => {

    // Mocking the API response with a custom message
    const successMessage = 'Member Added Successfully!';
    // Mocking the API response
    // Mocking the API response
    global.fetch = jest.fn().mockImplementationOnce(async (url, options) => {
      // Check if the URL and request body match the expected values
      const expectedUrl = 'http://localhost:5050/member/add/null';
      expect(url).toMatch(expectedUrl);
      expect(options.method).toBe('POST');
      const requestBody = JSON.parse(options.body);
      expect(requestBody).toEqual({
        email: 'test@gmail.com',
        password: 'testpassword',
        name: 'TestName',
        instrument: 'Tuba',
        yearOfStudy: '1',
        profilePic: null,
      });

      // Return a resolved promise with the mocked JSON response
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: successMessage }),
      });
    });


    render(<AddModal isOpen={true} onClose={() => { }} afterCloseCallback={() => { }} />);


    // Filling out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'TestName' } });
    fireEvent.change(screen.getByLabelText('Instrument'), { target: { value: 'Tuba' } });
    fireEvent.change(screen.getByLabelText('Year of Study'), { target: { value: 1 } });

    // Clicking the "Add" button
    userEvent.click(screen.getByText('Add'));

    // Wait for the API response to be processed
    await waitFor(() => {
      // Check if the expectations inside global.fetch are met
      expect(global.fetch).toHaveBeenCalled();
    });

    // Assertions
    const response = await global.fetch.mock.results[0].value; // Extract the entire response
    const jsonResponse = await response.json(); // Extract the JSON response
    // console.log(jsonResponse);
    expect(jsonResponse.message).toBe('Member Added Successfully!');

  });

  it('Handles email already in use', async () => {


    // Mocking the API response
    global.fetch = jest.fn().mockImplementationOnce(async (url, options) => {
      // Check if the URL and request body match the expected values
      const expectedUrl = 'http://localhost:5050/member/add/null';
      expect(url).toMatch(expectedUrl);
      expect(options.method).toBe('POST');
      const requestBody = JSON.parse(options.body);
      expect(requestBody).toEqual({
        email: 'test@gmail.com',
        password: 'testpassword',
        name: 'TestName',
        instrument: 'Tuba',
        yearOfStudy: '1',
        profilePic: null, // Make sure it matches your actual data structure
      });

      if (requestBody.email === 'test@gmail.com') {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: 'Email Already in Use' }),
        });
      } else {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ message: 'Member Added Successfully!' }),
        });
      }
    });

    render(<AddModal isOpen={true} onClose={() => { }} afterCloseCallback={() => { }} />);


    // Filling out the form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'TestName' } });
    fireEvent.change(screen.getByLabelText('Instrument'), { target: { value: 'Tuba' } });
    fireEvent.change(screen.getByLabelText('Year of Study'), { target: { value: 1 } });

    // Clicking the "Add" button
    userEvent.click(screen.getByText('Add'));

    // Wait for the API response to be processed
    await waitFor(() => {
      // Check if the expectations inside global.fetch are met
      expect(global.fetch).toHaveBeenCalled();
    });

    // Assertions
    const response = await global.fetch.mock.results[0].value; // Extract the entire response
    const jsonResponse = await response.json(); // Extract the JSON response
    // console.log(jsonResponse);
    expect(jsonResponse.message).toBe('Email Already in Use');

  });

});

