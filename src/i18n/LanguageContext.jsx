import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

export const LANGUAGES = ['es', 'ca', 'en']

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('bt-lang') || 'es'
  })

  const changeLanguage = (newLang) => {
    localStorage.setItem('bt-lang', newLang)
    setLang(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
