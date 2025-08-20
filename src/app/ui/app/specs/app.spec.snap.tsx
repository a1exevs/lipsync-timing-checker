import { render } from '@testing-library/react';
import React from 'react';

import App from 'src/app/ui/app/app';

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
