import { Nullable } from '@alexevs/ts-guards';
import React from 'react';

export enum ConfirmationDialogResult {
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
  OUTSIDE_CLICK = 'OUTSIDE_CLICK',
}

export type DialogActionsContextValue = {
  confirm: () => void;
  cancel: () => void;
  outsideClick: () => void;
};

export type MaybeRenderProp = React.ReactNode | ((actions: DialogActionsContextValue) => React.ReactNode);

export type ConfirmationDialogProps = {
  title: string;
  message?: string;
  confirmButtonText?: string;
  hideCancelButton?: boolean;
  modal?: boolean;
  header?: MaybeRenderProp;
  content?: MaybeRenderProp;
  footer?: MaybeRenderProp;
  initialFocusRef?: React.RefObject<Nullable<HTMLElement>>;
};

export type InternalDialogProps = ConfirmationDialogProps & {
  instanceId: string;
  isOpen: boolean;
  onResolve: (result: ConfirmationDialogResult) => void;
  isTop?: boolean;
  zIndexBase?: number;
};

export type OpenConfirmationDialog = (props: ConfirmationDialogProps) => Promise<ConfirmationDialogResult>;

export type StackedDialogData = {
  id: number;
  props: ConfirmationDialogProps;
  isOpen: boolean;
  resolve: (result: ConfirmationDialogResult) => void;
};

export type DialogContextValue = {
  open: OpenConfirmationDialog;
};
