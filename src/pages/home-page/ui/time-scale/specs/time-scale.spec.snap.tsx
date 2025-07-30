import { render } from '@testing-library/react';
import React from 'react';

import TimeScale from 'src/pages/home-page/ui/time-scale/time-scale';

describe('TimeScale', () => {
  const defaultProps = {
    durationSec: 10,
    timelineWidthPx: 1000,
    scrollLeftPx: 0,
    viewportWidthPx: 500,
    heightPx: 50,
  };

  it('matches snapshot (default)', () => {
    const { container } = render(<TimeScale {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot (scrolled)', () => {
    const { container } = render(<TimeScale {...defaultProps} scrollLeftPx={100} />);
    expect(container).toMatchSnapshot();
  });
});
