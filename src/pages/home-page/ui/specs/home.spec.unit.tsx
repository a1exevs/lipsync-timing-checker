import { render } from '@testing-library/react';
import * as React from 'react';

import HomePage from 'src/pages/home-page/ui/home-page';
import { capitalizeLabel, currentLang } from 'src/shared';

describe('HomePage', () => {
  it('Renders title of app', () => {
    const { getByText } = render(<HomePage />);
    const linkElement = getByText(capitalizeLabel(currentLang.labels.APP_NAME));
    expect(linkElement).toBeInTheDocument();
  });
});
