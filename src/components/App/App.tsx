import React from 'react';
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './styled';
import { defaultTheme } from '../../data/theme/default'
import Game from '../Game';

export type AppContextType = {};

export const AppContext = React.createContext<AppContextType>({});
export const ThemeContext = React.createContext(defaultTheme);

export default () => {
  const context = {};
  return (
    <AppContext.Provider value={context}>
      <ThemeProvider theme={defaultTheme} >
        <GlobalStyle />
        <Game />
      </ThemeProvider>
    </AppContext.Provider>
  )
}
