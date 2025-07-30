import { render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import IconButton from 'src/shared/ui/icon-button/icon-button';

describe('IconButton snapshots', () => {
  it('renders default', () => {
    const { asFragment } = render(
      <IconButton>
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders primary variant', () => {
    const { asFragment } = render(
      <IconButton variant="primary">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders secondary variant', () => {
    const { asFragment } = render(
      <IconButton variant="secondary">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders danger variant', () => {
    const { asFragment } = render(
      <IconButton variant="danger">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled', () => {
    const { asFragment } = render(
      <IconButton disabled>
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with size sm', () => {
    const { asFragment } = render(
      <IconButton size="sm">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with size md', () => {
    const { asFragment } = render(
      <IconButton size="md">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with size lg', () => {
    const { asFragment } = render(
      <IconButton size="lg">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with title', () => {
    const { asFragment } = render(
      <IconButton title="Test title">
        <FileAudio />
      </IconButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
