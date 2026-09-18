import { render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('passes form attributes through', () => {
    render(<Input aria-label="Email" type="email" />);

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
  });
});
