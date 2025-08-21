import { render } from '@testing-library/react';
import React from 'react';

import Resizer from 'src/pages/home-page/ui/resizer/resizer';
import { ResizerType } from 'src/pages/home-page/ui/resizer/resizer.types';

describe('Resizer', () => {
  const baseProps = {
    onMouseDown: jest.fn(),
    color: 'red',
    zIndex: 10,
    widthPx: 8,
  };
  it.each<ResizerType>(['left', 'right', 'chain'])('renders with type %s', type => {
    const { asFragment } = render(<Resizer {...baseProps} type={type} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
