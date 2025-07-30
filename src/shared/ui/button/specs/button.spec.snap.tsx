import { render } from '@testing-library/react';
import { FileAudio } from 'lucide-react';
import React from 'react';

import Button from 'src/shared/ui/button/button';

describe('Button snapshots', () => {
  it('renders default', () => {
    const { asFragment } = render(<Button text="Button" onClick={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders primary variant', () => {
    const { asFragment } = render(<Button text="Primary" onClick={() => {}} variant="primary" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders secondary variant', () => {
    const { asFragment } = render(<Button text="Secondary" onClick={() => {}} variant="secondary" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders danger variant', () => {
    const { asFragment } = render(<Button text="Danger" onClick={() => {}} variant="danger" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled', () => {
    const { asFragment } = render(<Button text="Disabled" onClick={() => {}} disabled />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with icon', () => {
    const { asFragment } = render(<Button text="With Icon" onClick={() => {}} icon={<FileAudio />} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with icon on the right', () => {
    const { asFragment } = render(
      <Button text="Right Icon" onClick={() => {}} icon={<FileAudio />} iconPosition="right" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with widthFull', () => {
    const { asFragment } = render(<Button text="Full Width" onClick={() => {}} widthFull />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with additionalClasses', () => {
    const { asFragment } = render(<Button text="Additional" onClick={() => {}} additionalClasses="test-class" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
