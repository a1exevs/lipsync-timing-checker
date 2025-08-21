import { render } from '@testing-library/react';
import React from 'react';

import { HomePage } from 'src/pages';
import { DialogProvider } from 'src/shared';

describe('HomePage', () => {
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
    const { container } = render(
      <DialogProvider>
        <HomePage />
      </DialogProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
