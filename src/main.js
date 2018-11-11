import React from 'react';
import { Provider } from 'react-redux';
import { YellowBox } from 'react-native';
import { SplashScreen } from 'expo';

import configureStore from './store';
import { ConnectedThemeContextProvider } from './views/ThemeContext';
import AuthSwitch from './views/AuthSwitch';

const store = configureStore();

class App extends React.Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings(['Setting a timer']);
    SplashScreen.preventAutoHide();
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedThemeContextProvider>
          <AuthSwitch />
        </ConnectedThemeContextProvider>
      </Provider>
    );
  }
}

export default App;
