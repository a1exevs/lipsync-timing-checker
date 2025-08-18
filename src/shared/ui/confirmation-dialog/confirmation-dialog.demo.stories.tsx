import type { Meta } from '@storybook/react';
import React from 'react';

import { ConfirmationDialogCancelButton, ConfirmationDialogConfirmButton, useDialogActions } from 'src/shared/ui';
import Button from 'src/shared/ui/button/button';
import {
  ConfirmationDialogProvider,
  useConfirmationDialog,
} from 'src/shared/ui/confirmation-dialog/confirmation-dialog.context';
import { ConfirmationDialogResult } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';
import { buildDesktopStoryObj, buildMobileStoryObj, buildTabletStoryObj } from 'storybook-dir/helpers';

const DemoInner: React.FC = () => {
  const openDefault = useConfirmationDialog({
    title: 'Delete file',
    message: 'Are you sure you want to delete this file? This action cannot be undone.',
    confirmButtonText: 'Delete',
  });
  const openRenderProps = useConfirmationDialog({
    title: 'Render-props footer',
    message: 'Custom footer via render-props.',
    footer: actions => (
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <button className="rounded-sm px-4 py-2 text-sm bg-gray-100" onClick={actions.cancel}>
          Cancel
        </button>
        <button className="rounded-sm px-4 py-2 text-sm bg-blue-600 text-white" onClick={actions.confirm}>
          Confirm
        </button>
      </div>
    ),
  });
  const openContext = useConfirmationDialog({
    title: 'Context footer',
    message: 'Custom footer via DialogActionsContext.',
    footer: () => {
      const { confirm, cancel } = useDialogActions();
      return (
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button className="rounded-sm px-4 py-2 text-sm bg-gray-100" onClick={cancel}>
            Cancel
          </button>
          <button className="rounded-sm px-4 py-2 text-sm bg-blue-600 text-white" onClick={confirm}>
            Confirm
          </button>
        </div>
      );
    },
  });
  const openCompounds = useConfirmationDialog({
    title: 'Compounds footer',
    message: 'Custom footer via compound buttons.',
    footer: (
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <ConfirmationDialogCancelButton />
        <ConfirmationDialogConfirmButton />
      </div>
    ),
  });
  const [lastResult, setLastResult] = React.useState<ConfirmationDialogResult | null>(null);

  const handle = async (fn: () => Promise<ConfirmationDialogResult>) => {
    const result = await fn();
    setLastResult(result);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <Button text="Open default" onClick={() => handle(openDefault)} />
        <Button text="Open (render-props)" onClick={() => handle(openRenderProps)} />
        <Button text="Open (context)" onClick={() => handle(openContext)} />
        <Button text="Open (compounds)" onClick={() => handle(openCompounds)} />
      </div>
      <div className="text-sm text-gray-600">Last result: {lastResult ?? '-'}</div>
    </div>
  );
};
const Demo: React.FC = () => (
  <ConfirmationDialogProvider>
    <DemoInner />
  </ConfirmationDialogProvider>
);
const storyTitle = 'Shared/ConfirmationDialog/Demo';

const meta = {
  title: storyTitle,
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;

export const Desktop = buildDesktopStoryObj<typeof meta>({});
export const Tablet = buildTabletStoryObj<typeof meta>({});
export const Mobile = buildMobileStoryObj<typeof meta>({});
