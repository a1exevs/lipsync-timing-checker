import classes from 'src/pages/home/ui/phoneme/phoneme.module.scss';
import React from 'react';
import cn from 'classnames';

type Props = {
  phoneme: string;
  widthPercent: number;
  withoutLeftBorder?: boolean;
  withoutRightBorder?: boolean;
};

const Phoneme: React.FC<Props> = ({ phoneme, widthPercent, withoutLeftBorder, withoutRightBorder }) => {
  return (
    <div
      className={cn(classes.Phoneme, {
        [classes.Phoneme_withoutLeftBorder]: withoutLeftBorder,
        [classes.Phoneme_withoutRightBorder]: withoutRightBorder,
      })}
      style={{ width: `${widthPercent}%` }}
    >
      {phoneme}
    </div>
  );
};

export default Phoneme;
