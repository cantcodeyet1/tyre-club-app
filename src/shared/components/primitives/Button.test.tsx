import { render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders accessible button text', () => {
    render(<Button>Save vehicle</Button>);

    expect(
      screen.getByRole('button', { name: /save vehicle/i }),
    ).toBeInTheDocument();
  });
});
