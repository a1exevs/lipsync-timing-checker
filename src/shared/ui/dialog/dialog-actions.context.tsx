import { Nullable } from '@alexevs/ts-guards';
import React from 'react';

import { DialogActionsContextValue } from 'src/shared/ui/dialog/dialog.types';

export const DialogActionsContext = React.createContext<Nullable<DialogActionsContextValue>>(null);
