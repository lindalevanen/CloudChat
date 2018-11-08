import React from 'react';
import { ThemeContext } from '../../views/ThemeContext';

export const withTheme = Component => props => (
  <ThemeContext.Consumer>
    {value => <Component useDarkTheme={value} {...props} />}
  </ThemeContext.Consumer>
);
