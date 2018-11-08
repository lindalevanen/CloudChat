import React from 'react';
import { View, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import ChatMock from '../Chats';
import ProfileView from '../Profile';
import ChangeUsernameSheet from '../Profile/ChangeUsernameSheet';
import AvatarSelectorSheet from '../Profile/AvatarSelectorSheet';
import SettingsView from '../Settings';

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
        headerTitle: 'Chats',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-chatbubbles" size={25} color={tintColor} />,
      },
    },
    Contacts: {
      screen: () => <Test text="Contacts" />,
      navigationOptions: {
        headerTitle: 'Contacts',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-contacts" size={25} color={tintColor} />,
      },
    },
    Profile: {
      screen: ProfileView,
      navigationOptions: {
        headerTitle: 'Profile',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={25} color={tintColor} />,
      },
    },
    Settings: {
      screen: SettingsView,
      navigationOptions: {
        headerTitle: 'Settings',
        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-cog" size={25} color={tintColor} />,
      },
    },
  },
  {
    initialRouteName: 'Chats',
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
      headerTitle: 'CloudChat',
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
});
