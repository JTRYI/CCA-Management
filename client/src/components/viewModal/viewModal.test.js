import React from "react";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewModal from "./viewModal";

describe('ViewModal Component', () => {
    it('Renders modal with member information', async () => {
      const mockMember = {
        name: 'Robert',
        email: 'robert@gmail.com',
        instrument: 'Tuba',
        dateJoined: '03-01-2024',
        yearOfStudy: '3',
      };
  
      // Mocking the fetch response
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMember),
        })
      );
  
      render(<ViewModal onClose={() => {}} isOpen memberID={1} />);
  
      // Wait for the data to be loaded
      await waitFor(() => screen.getByText('Robert'));
  
      // Assertions
      expect(screen.getByText('Robert')).toBeInTheDocument();
      expect(screen.getByText('robert@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Tuba')).toBeInTheDocument();
      expect(screen.getByText('03-01-2024')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

    });
});  