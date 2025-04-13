import React, { MouseEvent, RefObject, useRef } from 'react';
import classes from 'src/pages/home/ui/word/word.module.scss';
import cn from 'classnames';
import { JSONWord, ResizerSide } from 'src/pages/home/model/types';

type Props = {
  word: JSONWord;
  width: string;
  left: string;
  selected: boolean;
  onResizeStart: (event: MouseEvent, ref: RefObject<HTMLDivElement>, resizerSide: ResizerSide) => void;
};

const Word: React.FC<Props> = ({ word, width, left, selected, onResizeStart }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn(classes.Word, {
        [classes.Word_selected]: selected,
      })}
      style={{ left, width }}
      data-id={word.id}
    >
      <div className={classes.LeftResizer} onMouseDown={e => onResizeStart(e, ref, 'left')}></div>
      <span>{word.word}</span>
      <div className={classes.RightResizer} onMouseDown={e => onResizeStart(e, ref, 'right')}></div>
    </div>
  );
};

export default Word;
