import { fireEvent, render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import IconButton from 'src/shared/ui/icon-button/icon-button';

describe('IconButton', () => {
  it('renders children', () => {
    const { getByTestId } = render(
      <IconButton>
        <FileAudio data-testid="icon" />
      </IconButton>,
    );
    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <IconButton onClick={handleClick}>
        <FileAudio />
      </IconButton>,
    );
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(
      <IconButton disabled>
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button')).toBeDisabled();
  });

  it('applies the correct variant styles', () => {
    const { getByRole, rerender } = render(
      <IconButton variant="primary">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/bg-blue-600/);
    rerender(
      <IconButton variant="secondary">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/bg-gray-100/);
    rerender(
      <IconButton variant="danger">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/bg-red-600/);
  });

  it('applies the correct size styles', () => {
    const { getByRole, rerender } = render(
      <IconButton size="sm">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/w-8/);
    rerender(
      <IconButton size="md">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/w-10/);
    rerender(
      <IconButton size="lg">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button').className).toMatch(/w-12/);
  });

  it('sets the title attribute if provided', () => {
    const { getByRole } = render(
      <IconButton title="Test title">
        <FileAudio />
      </IconButton>,
    );
    expect(getByRole('button')).toHaveAttribute('title', 'Test title');
  });
});
