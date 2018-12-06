import React from 'react';
import { View, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import UserSearch from '../../components/UserSearch';
import ChatMock from '../Chats';
import SettingsView from '../Settings';
import ThemedTabBarComponent from './ThemedTabBarComponent';

import ChangeUsernameSheet from '../Settings/ProfileSettings/ChangeUsernameSheet';
import AvatarSelectorSheet from '../Settings/ProfileSettings/AvatarSelectorSheet';
import CreateChatSheet from '../Chats/CreateChatSheet';
import CreateGroupSheet from '../Chats/CreateGroupSheet';
import ChatScreen from '../ChatScreen';
import OneToOneChat from '../ChatScreen/OneToOneChat';
import ChatInfoScreen from '../ChatScreen/ChatInfoScreen';
import UserInfoScreen from '../UserInfoScreen';

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
      screen: UserSearch,
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
  CreateChatSheet: {
    screen: CreateChatSheet,
    navigationOptions: {
      headerTitle: 'New chat',
    },
  },
  CreateGroupSheetSheet: {
    screen: CreateGroupSheet,
    navigationOptions: {
      header: ThemedHeaderComponent,
      headerTitle: 'Select group members',
    },
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: {
      header: ThemedHeaderComponent,
    },
  },
  OneToOneChatScreen: {
    screen: OneToOneChat,
    navigationOptions: {
      header: ThemedHeaderComponent,
    },
  },
  ChatInfoScreen: {
    screen: ChatInfoScreen,
    navigationOptions: {
      header: ThemedHeaderComponent,
    },
  },
  UserInfoScreen: {
    screen: UserInfoScreen,
  },
}, {
  // mode: 'modal',
  headerMode: 'screen',
  navigationOptions: resolveNavigationOptionsForScreen,
});
