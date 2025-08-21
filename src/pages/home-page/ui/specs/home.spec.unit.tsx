import { render } from '@testing-library/react';
import * as React from 'react';

import HomePage from 'src/pages/home-page/ui/home-page';
import { capitalizeLabel, currentLang, DialogProvider } from 'src/shared';

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

  it('Renders title of app', () => {
    const { getByText } = render(
      <DialogProvider>
        <HomePage />
      </DialogProvider>,
    );
    const linkElement = getByText(capitalizeLabel(currentLang.labels.APP_NAME));
    expect(linkElement).toBeInTheDocument();
  });
});
