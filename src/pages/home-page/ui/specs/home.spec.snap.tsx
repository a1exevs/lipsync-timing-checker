import { render } from '@testing-library/react';
import React from 'react';

import { HomePage } from 'src/pages';

describe('HomePage', () => {
  it('matches snapshot', () => {
    const { container } = render(<HomePage />);
    expect(container).toMatchSnapshot();
  });
});
