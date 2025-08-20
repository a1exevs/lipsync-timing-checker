import type { Meta } from '@storybook/react';
import React from 'react';

import { ConfirmationDialogCancelButton, ConfirmationDialogConfirmButton, useDialogActions } from 'src/shared/ui';
import Dialog from 'src/shared/ui/dialog/dialog';
import { buildDesktopStoryObj, buildMobileStoryObj, buildTabletStoryObj } from 'storybook-dir/helpers';

const storyTitle = 'Shared/Dialog/Direct';

const noop = () => {};

const meta = {
  title: storyTitle,
  component: Dialog,
  args: {
    isOpen: true,
    onResolve: noop,
    title: 'Confirm action',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

export const DefaultDesktop = buildDesktopStoryObj<typeof meta>({});
export const DefaultTablet = buildTabletStoryObj<typeof meta>({});
export const DefaultMobile = buildMobileStoryObj<typeof meta>({});

export const WithMessageDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Delete file',
    message: 'Are you sure you want to delete this file? This action cannot be undone.',
    confirmButtonText: 'Delete',
  },
});
export const WithMessageTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Delete file',
    message: 'Are you sure you want to delete this file? This action cannot be undone.',
    confirmButtonText: 'Delete',
  },
});
export const WithMessageMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Delete file',
    message: 'Are you sure you want to delete this file? This action cannot be undone.',
    confirmButtonText: 'Delete',
  },
});

export const WithoutCancelDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Proceed',
    hideCancelButton: true,
  },
});
export const WithoutCancelTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Proceed',
    hideCancelButton: true,
  },
});
export const WithoutCancelMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Proceed',
    hideCancelButton: true,
  },
});

export const ModalDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Modal dialog',
    modal: true,
  },
});
export const ModalTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Modal dialog',
    modal: true,
  },
});
export const ModalMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Modal dialog',
    modal: true,
  },
});

export const CustomSlotsDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    header: <div className="px-4 py-3 border-b">Custom header</div>,
    content: (
      <div className="px-4 py-4">
        <p>Custom content</p>
      </div>
    ),
    footer: (
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <ConfirmationDialogCancelButton />
        <ConfirmationDialogConfirmButton />
      </div>
    ),
  },
});
export const CustomSlotsTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    header: <div className="px-4 py-3 border-b">Custom header</div>,
    content: (
      <div className="px-4 py-4">
        <p>Custom content</p>
      </div>
    ),
    footer: (
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <ConfirmationDialogCancelButton />
        <ConfirmationDialogConfirmButton />
      </div>
    ),
  },
});
export const CustomSlotsMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    header: <div className="px-4 py-3 border-b">Custom header</div>,
    content: (
      <div className="px-4 py-4">
        <p>Custom content</p>
      </div>
    ),
    footer: (
      <div className="px-4 py-3 border-t flex justify-end gap-2">
        <ConfirmationDialogCancelButton />
        <ConfirmationDialogConfirmButton />
      </div>
    ),
  },
});

// Render-props variant
export const RenderPropsDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Render-props footer',
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
  },
});
export const RenderPropsTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Render-props footer',
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
  },
});
export const RenderPropsMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Render-props footer',
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
  },
});

// Context variant
const ContextFooter: React.FC = () => {
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
};

export const ContextDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Context footer',
    footer: <ContextFooter />,
  },
});
export const ContextTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Context footer',
    footer: <ContextFooter />,
  },
});
export const ContextMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Context footer',
    footer: <ContextFooter />,
  },
});

// Compounds alias
export const CompoundsDesktop = CustomSlotsDesktop;
export const CompoundsTablet = CustomSlotsTablet;
export const CompoundsMobile = CustomSlotsMobile;

export const LongScrollableContentDesktop = buildDesktopStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Long content',
    content: (
      <div className="px-4 py-4 space-y-3">
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        ))}
      </div>
    ),
  },
});
export const LongScrollableContentTablet = buildTabletStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    onResolve: () => {},
    title: 'Long content',
    content: (
      <div className="px-4 py-4 space-y-3">
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        ))}
      </div>
    ),
  },
});
export const LongScrollableContentMobile = buildMobileStoryObj<typeof meta>({
  args: {
    instanceId: 'dialog',
    title: 'Long content',
    onResolve: () => {},
    content: (
      <div className="px-4 py-4 space-y-3">
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        ))}
      </div>
    ),
  },
});
