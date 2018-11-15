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
import InitChat from '../Chats/InitChat';
import ThemedHeaderComponent from '../../components/ThemedHeaderComponent';
import { resolveNavigationOptionsForScreen } from './routeUtils';

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
  },
);

export default createStackNavigator({
  Home: {
    screen: Tabs,
  },
  ChangeUsernameSheet: {
    screen: ChangeUsernameSheet,
    navigationOptions: {
      header: ThemedHeaderComponent,
      headerTitle: 'Change username',
    },
  },
  AvatarSelectorSheet: {
    screen: AvatarSelectorSheet,
    navigationOptions: {
      header: ThemedHeaderComponent,
      headerTitle: 'Select your avatar',
    },
  },
  InitChatSheet: {
    screen: InitChat,
    navigationOptions: {
      header: ThemedHeaderComponent,
      headerTitle: 'Create Group chat',
    },
  },
}, {
  mode: 'modal',
  headerMode: 'screen',
  navigationOptions: resolveNavigationOptionsForScreen,
});
