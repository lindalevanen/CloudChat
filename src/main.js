import React from 'react';
import { Provider, connect } from 'react-redux';

import configureStore from './store';
import HomeScreen from './views/HomeScreen';

class Main extends React.Component {
  async componentDidMount() {
    const { registerListenerAction } = this.props;
    registerListenerAction();
  }

  render() {
    return <HomeScreen />;
  }
}

const mapDispatchToProps = dispatch => ({
  registerListenerAction: () => dispatch({ type: 'lul' }),
});

const Connected = connect(
  null,
  mapDispatchToProps,
)(Main);

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Connected />
  </Provider>
);

export default App;
