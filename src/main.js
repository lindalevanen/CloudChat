import React from 'react';
import { Provider, connect } from 'react-redux';

import configureStore from './store';
import HomeScreen from './views/HomeScreen';

class Main extends React.Component {
  async componentDidMount() {
    const { testAction } = this.props;
    testAction();
  }

  render() {
    return <HomeScreen />;
  }
}

const mapDispatchToProps = dispatch => ({
  testAction: () => dispatch({ type: 'test' }),
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
