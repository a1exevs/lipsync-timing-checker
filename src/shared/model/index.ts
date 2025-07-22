import { arrayToObject } from 'src/shared/model/helpers/arrays';
import { getExtensionByFile, getFileData } from 'src/shared/model/helpers/files';
import { throttleTime } from 'src/shared/model/helpers/intervals';
import { capitalize, capitalizeLabel } from 'src/shared/model/helpers/strings';
import { currentLang } from 'src/shared/model/lang/lang.helpers';
import { KeyOfValue } from 'src/shared/model/types/common';

// helpers
export { arrayToObject, getFileData, getExtensionByFile, throttleTime, capitalizeLabel, capitalize };

// lang
export { currentLang };

// types
export type { KeyOfValue };
