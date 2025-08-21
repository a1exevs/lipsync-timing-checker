// ui
export {
  Button,
  FilePicker,
  IconButton,
  useConfirmationDialog,
  useInfoDialog,
  DialogResponse,
  useDialogActions,
  ConfirmationDialogConfirmButton,
  ConfirmationDialogCancelButton,
  DialogProvider,
} from 'src/shared/ui';

// api
export {
  arrayToObject,
  getExtensionByFile,
  getFileData,
  capitalize,
  capitalizeLabel,
  throttleTime,
} from 'src/shared/model';

// model
export type { KeyOfValue } from 'src/shared/model';
export {
  currentLang,
  DESKTOP_4K_SCREEN_WIDTH_PX,
  DESKTOP_SCREEN_WIDTH_PX,
  TABLET_SCREEN_WIDTH_PX,
  MOBILE_SCREEN_WIDTH_PX,
} from 'src/shared/model';
