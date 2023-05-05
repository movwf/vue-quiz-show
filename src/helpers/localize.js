import tr from '@/localization/tr.json'
import en from '@/localization/en.json'

const langs = {
  tr,
  en
}

export default function t(key) {
  const currentLang = localStorage.getItem('quiz-language') || 'en'

  return langs[currentLang][key]
}
