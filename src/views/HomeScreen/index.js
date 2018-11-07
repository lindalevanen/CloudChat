import React from 'react';
import { View, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import ChatMock from '../Chats';
import ProfileView from '../Profile';

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
      screen: () => <Test text="Settings" />,
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
}, {
  mode: 'modal',
  headerMode: 'float',
});
