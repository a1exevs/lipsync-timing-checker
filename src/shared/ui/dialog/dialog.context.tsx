import { Nullable } from '@alexevs/ts-guards';
import { createContext } from 'react';

import { DialogContextValue } from 'src/shared/ui/dialog/dialog.types';

export const ConfirmationDialogContext = createContext<Nullable<DialogContextValue>>(null);
