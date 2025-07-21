import { lang, LanguageCode, LanguageConstants } from 'src/shared/model/lang/lang';

const defaultLang: LanguageCode = 'en';

export const currentLang: LanguageConstants = lang[defaultLang];
