import ThemedHeaderComponent from '../../components/ThemedHeaderComponent';

import { getState } from '../../store';

export function resolveNavigationOptionsForScreen({ navigation }) {
  let name;

  const { index } = navigation.state;
  if (index === undefined) {
    name = navigation.state.routeName;
  } else {
    const { routeName } = navigation.state.routes[index];
    name = routeName;
  }
  const headerTitle = name;

  const { useDarkTheme } = getState().settings;

  return {
    headerTitle,
    headerStyle: {
      backgroundColor: useDarkTheme ? '#191B2C' : 'white',
      borderBottomColor: useDarkTheme ? '#0E0E19' : 'grey',
    },
    headerTitleStyle: {
      color: useDarkTheme ? 'white' : 'black',
    },
    header: ThemedHeaderComponent,
  };
}