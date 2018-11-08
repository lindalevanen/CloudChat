import React from 'react';
import { Provider } from 'react-redux';
import { SplashScreen } from 'expo';

import configureStore from './store';
import { ConnectedThemeContextProvider } from './views/ThemeContext';
import AuthSwitch from './views/AuthSwitch';

const store = configureStore();

class App extends React.Component {
  constructor() {
    super();
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
