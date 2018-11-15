import React from 'react';
import { ThemeContext } from '../../views/ThemeContext';
import lightTheme from '../../styles/colors/lightTheme';
import darkTheme from '../../styles/colors/darkTheme';

const themes = {
  true: darkTheme,
  false: lightTheme,
};

export const withTheme = Component => props => (
  <ThemeContext.Consumer>
    {value => <Component useDarkTheme={value} theme={themes[value]} {...props} />}
  </ThemeContext.Consumer>
);
