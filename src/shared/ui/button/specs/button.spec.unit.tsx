import { fireEvent, render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import Button from 'src/shared/ui/button/button';

describe('Button', () => {
  it('renders with default props', () => {
    const { getByText } = render(<Button text="Button" onClick={() => {}} />);
    expect(getByText('Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button text="Click me" onClick={handleClick} />);
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button text="Disabled" onClick={() => {}} disabled />);
    expect(getByRole('button')).toBeDisabled();
  });

  it('applies widthFull class when widthFull is true', () => {
    const { getByRole } = render(<Button text="Full Width" onClick={() => {}} widthFull />);
    expect(getByRole('button').className).toMatch(/w-full/);
  });

  it('applies the correct variant styles', () => {
    const { getByRole, rerender } = render(<Button text="Primary" onClick={() => {}} variant="primary" />);
    expect(getByRole('button').className).toMatch(/bg-blue-600/);
    rerender(<Button text="Secondary" onClick={() => {}} variant="secondary" />);
    expect(getByRole('button').className).toMatch(/bg-gray-100/);
    rerender(<Button text="Danger" onClick={() => {}} variant="danger" />);
    expect(getByRole('button').className).toMatch(/bg-red-600/);
  });

  it('renders icon when icon prop is provided', () => {
    const { container } = render(
      <Button text="With Icon" onClick={() => {}} icon={<FileAudio data-testid="icon" />} />,
    );
    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('renders icon on the right when iconPosition is right', () => {
    const { getByText } = render(
      <Button text="Right Icon" onClick={() => {}} icon={<FileAudio data-testid="icon" />} iconPosition="right" />,
    );
    const button = getByText('Right Icon').closest('button');
    expect(button?.className).toMatch(/flex-row-reverse/);
  });

  it('applies additionalClasses prop', () => {
    const { getByRole } = render(<Button text="Additional" onClick={() => {}} additionalClasses="test-class" />);
    expect(getByRole('button').className).toMatch(/test-class/);
  });
});
