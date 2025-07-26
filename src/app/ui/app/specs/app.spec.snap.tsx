import { render } from '@testing-library/react';
import React from 'react';

import App from 'src/app/ui/app/app';

describe('App', () => {
  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
