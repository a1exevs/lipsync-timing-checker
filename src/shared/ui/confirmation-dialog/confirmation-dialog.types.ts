import { Nullable } from '@alexevs/ts-guards';
import React from 'react';

export enum ConfirmationDialogResult {
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
  OUTSIDE_CLICK = 'OUTSIDE_CLICK',
}

export type ConfirmationDialogActions = {
  confirm: () => void;
  cancel: () => void;
  outsideClick: () => void;
};

export type MaybeRenderProp = React.ReactNode | ((actions: ConfirmationDialogActions) => React.ReactNode);

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

export type OpenConfirmationDialog = (props: ConfirmationDialogProps) => Promise<ConfirmationDialogResult>;
