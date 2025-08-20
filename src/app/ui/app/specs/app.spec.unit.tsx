import { render } from '@testing-library/react';
import * as React from 'react';

import App from 'src/app/ui/app/app';
import { capitalizeLabel, currentLang } from 'src/shared';

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

  it('Renders title of app', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(capitalizeLabel(currentLang.labels.APP_NAME));
    expect(linkElement).toBeInTheDocument();
  });
});
