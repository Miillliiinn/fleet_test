import { render, screen } from '@testing-library/react';
import App from './app/App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/fleet device manager/i);
  expect(titleElement).toBeInTheDocument();
});
