import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store';

jest.mock('./firebase/services/portfolio.service', () => ({
  getFirstPortfolioWithUserId: jest.fn(() => Promise.resolve(null)),
  getPortfolio: jest.fn(() => Promise.resolve(null)),
}));

test('renders a portfolio heading', async () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  );
  expect(await screen.findByRole('heading', { level: 1, name: /building a better experience/i })).toBeInTheDocument();
});
