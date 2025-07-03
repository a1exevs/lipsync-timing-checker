import { isNull, Nullable } from '@alexevs/ts-guards';
import React, { useEffect, useRef } from 'react';

import {
  HALF_SECOND_TICK_X_OFFSET,
  SUB_SECOND_TICK_X_OFFSET,
  TICK_STEP_THRESHOLD_HALF_SECOND,
  TICK_STEP_THRESHOLD_SUB_SECOND,
  TIME_SCALE_TEXT_COLOR,
  TIME_SCALE_TEXT_FONT,
  TIME_SCALE_TICK_COLOR,
  WHOLE_SECOND__TICK_X_OFFSET,
} from 'src/pages/home/model/consts';

type Props = {
  duration: number;
  timelineWidth: number;
  scrollLeft: number;
  viewportWidth: number;
  height: number;
};

const TimeScale: React.FC<Props> = ({ duration, timelineWidth, scrollLeft, viewportWidth, height }) => {
  const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (isNull(canvas)) {
      return;
    }

    canvas.width = viewportWidth;
    canvas.height = height;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (isNull(ctx)) {
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, viewportWidth, height);

    ctx.strokeStyle = TIME_SCALE_TICK_COLOR;
    ctx.fillStyle = TIME_SCALE_TEXT_COLOR;
    ctx.font = TIME_SCALE_TEXT_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const pxPerSecond = timelineWidth / duration;
    let loopStep = 1;
    if (pxPerSecond >= TICK_STEP_THRESHOLD_SUB_SECOND) {
      loopStep = 0.1;
    } else if (pxPerSecond >= TICK_STEP_THRESHOLD_HALF_SECOND) {
      loopStep = 0.5;
    } else {
      loopStep = 1;
    }

    const startT = Math.floor(scrollLeft / pxPerSecond);
    const endT = Math.ceil((scrollLeft + viewportWidth) / pxPerSecond);

    for (let t = startT; t <= endT; t += loopStep) {
      const time = Number(t.toFixed(2));
      const x = time * pxPerSecond - scrollLeft;
      if (x < -20 || x > viewportWidth + 20) {
        continue;
      }

      const isWhole = Number.isInteger(time);
      const isHalf = time % 1 === 0.5;

      if (isWhole) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(0)} s`, x + WHOLE_SECOND__TICK_X_OFFSET, 0.5 * height);
      } else if (isHalf) {
        ctx.beginPath();
        ctx.moveTo(x, height * 0.4);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(1)} s`, x + HALF_SECOND_TICK_X_OFFSET, 0.5 * height);
      } else {
        ctx.beginPath();
        ctx.moveTo(x, height * 0.7);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(1)} s`, x + SUB_SECOND_TICK_X_OFFSET, 0.5 * height);
      }
    }
  }, [duration, timelineWidth, scrollLeft, viewportWidth, height]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default TimeScale;
