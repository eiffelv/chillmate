import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock IntersectionObserver before tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));
window.IntersectionObserver = mockIntersectionObserver;

test('renders home page', () => {
  render(
    <BrowserRouter>
      <App router={false} />
    </BrowserRouter>
  );
  expect(screen.getByText(/chillmate/i)).toBeInTheDocument();
});
