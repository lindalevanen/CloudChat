import React from 'react';
import { View, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import ChatMock from '../Chats';
import SettingsView from '../Settings';
import ThemedTabBarComponent from './ThemedTabBarComponent';
import ChangeUsernameSheet from '../Settings/ProfileSettings/ChangeUsernameSheet';
import AvatarSelectorSheet from '../Settings/ProfileSettings/AvatarSelectorSheet';
import ThemedHeaderComponent from '../../components/ThemedHeaderComponent';
import { resolveHeaderTitleForRoute } from './routeUtils';

const Test = ({ text }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{text}</Text>
  </View>
);

const Tabs = createBottomTabNavigator(
  {
    Chats: {
      screen: ChatMock,
      navigationOptions: {
        title: 'Chats',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-chatbubbles" size={25} color={tintColor} />,
      },
    },
    Contacts: {
      screen: () => <Test text="Contacts" />,
      navigationOptions: {
        title: 'Contacts',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-contacts" size={25} color={tintColor} />,
      },
    },
    Settings: {
      screen: SettingsView,
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-cog" size={25} color={tintColor} />,
      },
    },
  },
  {
    initialRouteName: 'Chats',
    tabBarComponent: ThemedTabBarComponent,
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  },
);

export default createStackNavigator({
  Home: {
    screen: Tabs,
    navigationOptions: {
      header: ThemedHeaderComponent,
    },
  },
  ChangeUsernameSheet: {
    screen: ChangeUsernameSheet,
    navigationOptions: {
      headerTitle: 'Change username',
    },
  },
  AvatarSelectorSheet: {
    screen: AvatarSelectorSheet,
    navigationOptions: {
      headerTitle: 'Select your avatar',
    },
  },
}, {
  mode: 'modal',
  headerMode: 'screen',
  navigationOptions: resolveHeaderTitleForRoute,
});
