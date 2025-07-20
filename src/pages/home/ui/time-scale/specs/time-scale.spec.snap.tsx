import { render } from '@testing-library/react';
import React from 'react';

import TimeScale from 'src/pages/home/ui/time-scale/time-scale';

describe('TimeScale', () => {
  const defaultProps = {
    duration: 10,
    timelineWidth: 1000,
    scrollLeft: 0,
    viewportWidth: 500,
    height: 50,
  };

  it('matches snapshot (default)', () => {
    const { container } = render(<TimeScale {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot (scrolled)', () => {
    const { container } = render(<TimeScale {...defaultProps} scrollLeft={100} />);
    expect(container).toMatchSnapshot();
  });
});
