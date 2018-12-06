import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ThemedHeaderComponent from '../../components/ThemedHeaderComponent';
import lightTheme from '../../styles/colors/lightTheme';
import darkTheme from '../../styles/colors/darkTheme';
import colors from '../../styles/colors';
import { getState } from '../../store';
import HeaderButton from '../../components/HeaderButton';
import ChatScreenHeaderButton, { OneToOneChatHeaderButton } from '../../components/ChatScreenHeaderButton';

function getNavigationCallback(navigation, routeName) {
  return () => navigation.navigate(routeName);
}

function getHeaderActionForRoute(routeName, navigation) {
  switch (routeName) {
    case 'Chats':
      return (
        <HeaderButton
          navigation={navigation}
          onPress={getNavigationCallback(navigation, 'CreateChatSheet')}
        >
          <MaterialCommunityIcons name="plus" size={24} color={colors.blush} />
        </HeaderButton>
      );
    case 'ChatScreen':
      return <ChatScreenHeaderButton navigation={navigation} />;
    case 'OneToOneChatScreen':
      return <OneToOneChatHeaderButton navigation={navigation} />;
    default:
      return null;
  }
}

export function resolveNavigationOptionsForScreen({ navigation }) {
  let headerTitle;
  let route;
  const { params, index } = navigation.state;
  if (params && params.headerTitle) {
    headerTitle = params.headerTitle;
    route = navigation.state.routeName;
  } else if (index === undefined) {
    headerTitle = navigation.state.routeName;
    route = navigation.state.routeName;
  } else {
    const { routeName } = navigation.state.routes[index];
    headerTitle = routeName;
    route = routeName;
  }

  const { useDarkTheme } = getState().settings;
  const theme = useDarkTheme ? darkTheme : lightTheme;

  return {
    headerBackTitle: headerTitle,
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
    headerRight: getHeaderActionForRoute(route, navigation),
  };
}
