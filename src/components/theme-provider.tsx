import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme : Theme;
    toggleTheme : () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };

export const ThemeProvider = ({children} : {children : any}) => {
    const [theme,setTheme] = useState<Theme>('light')
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    useEffect(() => {
        document.body.className = theme;
    },[theme])

    const contextValue = useMemo<ThemeContextType>(
        () => ({
            theme,toggleTheme
        }),[theme,toggleTheme]
    )

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
}