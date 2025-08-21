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
} from 'src/pages/home-page/model/consts';

type Props = {
  durationSec: number;
  timelineWidthPx: number;
  scrollLeftPx: number;
  viewportWidthPx: number;
  heightPx: number;
};

const TimeScale: React.FC<Props> = ({ durationSec, timelineWidthPx, scrollLeftPx, viewportWidthPx, heightPx }) => {
  const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (isNull(canvas)) {
      return;
    }

    canvas.width = viewportWidthPx;
    canvas.height = heightPx;
    canvas.style.width = `${viewportWidthPx}px`;
    canvas.style.height = `${heightPx}px`;

    const ctx = canvas.getContext('2d');
    if (isNull(ctx)) {
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, viewportWidthPx, heightPx);

    ctx.strokeStyle = TIME_SCALE_TICK_COLOR;
    ctx.fillStyle = TIME_SCALE_TEXT_COLOR;
    ctx.font = TIME_SCALE_TEXT_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const pxPerSecond = timelineWidthPx / durationSec;
    let loopStep = 1;
    if (pxPerSecond >= TICK_STEP_THRESHOLD_SUB_SECOND) {
      loopStep = 0.1;
    } else if (pxPerSecond >= TICK_STEP_THRESHOLD_HALF_SECOND) {
      loopStep = 0.5;
    } else {
      loopStep = 1;
    }

    const startT = Math.floor(scrollLeftPx / pxPerSecond);
    const endT = Math.ceil((scrollLeftPx + viewportWidthPx) / pxPerSecond);

    for (let t = startT; t <= endT; t += loopStep) {
      const time = Number(t.toFixed(2));
      const x = time * pxPerSecond - scrollLeftPx;
      if (x < -20 || x > viewportWidthPx + 20) {
        continue;
      }

      const isWhole = Number.isInteger(time);
      const isHalf = time % 1 === 0.5;

      if (isWhole) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(0)} s`, x + WHOLE_SECOND__TICK_X_OFFSET, 0.5 * heightPx);
      } else if (isHalf) {
        ctx.beginPath();
        ctx.moveTo(x, heightPx * 0.4);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(1)} s`, x + HALF_SECOND_TICK_X_OFFSET, 0.5 * heightPx);
      } else {
        ctx.beginPath();
        ctx.moveTo(x, heightPx * 0.7);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
        ctx.fillText(`${time.toFixed(1)} s`, x + SUB_SECOND_TICK_X_OFFSET, 0.5 * heightPx);
      }
    }
  }, [durationSec, timelineWidthPx, scrollLeftPx, viewportWidthPx, heightPx]);

  return (
    <section
      className="flex overflow-x-auto overflow-y-hidden border border-gray-300"
      style={{ scrollbarWidth: 'none' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </section>
  );
};

export default TimeScale;
