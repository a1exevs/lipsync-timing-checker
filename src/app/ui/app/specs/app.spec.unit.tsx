import { render } from '@testing-library/react';
import * as React from 'react';

import App from 'src/app/ui/app/app';
import { capitalizeLabel, currentLang } from 'src/shared';

describe('App', () => {
  it('Renders title of app', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(capitalizeLabel(currentLang.labels.APP_NAME));
    expect(linkElement).toBeInTheDocument();
  });
});
