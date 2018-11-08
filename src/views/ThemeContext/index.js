import React from 'react';
import { connect } from 'react-redux';

export const ThemeContext = React.createContext();

const ThemeContextProvider = ({ children, useDarkTheme }) => (
  <ThemeContext.Provider value={useDarkTheme}>{children}</ThemeContext.Provider>
);

export const ConnectedThemeContextProvider = connect(
  ({ settings: { useDarkTheme } }) => ({ useDarkTheme }),
)(ThemeContextProvider);
