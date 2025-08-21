import { Nullable } from '@alexevs/ts-guards';

import { DIALOG_PORTAL_ROOT_ATTR } from 'src/shared/ui/dialog/dialog.consts';

export const getOrBuildDialogPortalRoot = (): Nullable<HTMLElement> => {
  if (typeof document === 'undefined') {
    return null;
  }
  let root = document.querySelector<HTMLElement>(`[${DIALOG_PORTAL_ROOT_ATTR}]`);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute(DIALOG_PORTAL_ROOT_ATTR, '');
    document.body.appendChild(root);
  }
  return root;
};
