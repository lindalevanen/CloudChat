import React from 'react';
import { Platform } from 'react-native';

import ThemedHeaderComponent from '../../components/ThemedHeaderComponent';
import lightTheme from '../../styles/colors/lightTheme';
import darkTheme from '../../styles/colors/darkTheme';
import { getState } from '../../store';
import HeaderButton from '../../components/HeaderButton';

function getNavigationCallback(navigation, routeName) {
  return () => navigation.navigate(routeName);
}

function getHeaderActionForRoute(routeName, navigation) {
  switch (routeName) {
    case 'Chats':
      return <HeaderButton navigation={navigation} title="New chat" onPress={getNavigationCallback(navigation, 'CreateChatSheet')} />;
    default:
      return null;
  }
}

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
  const theme = useDarkTheme ? darkTheme : lightTheme;

  return {
    headerBackTitle: name,
    headerTitle,
    headerStyle: {
      backgroundColor: theme.topBar,
      borderBottomColor: theme.separator,
    },
    headerTitleStyle: {
      color: theme.text1,
    },
    headerTintColor: Platform.OS === 'ios' ? theme.actionHero : theme.text1,
    header: ThemedHeaderComponent,
    headerRight: getHeaderActionForRoute(name, navigation),
  };
}
