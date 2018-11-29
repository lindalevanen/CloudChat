import React from 'react';
import { View } from 'react-native';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';

import UserSearch from '../../components/UserSearch';
import Button from '../../components/Button';
import { withTheme } from '../../components/ThemedWrapper';

const CreateChatSheet = ({ theme, navigation }) => {
  const openGroupChatSheet = () => navigation.dispatch(
    StackActions.push({
      routeName: 'CreateGroupSheetSheet',
    }),
  );
  const openOneToOneChat = user => navigation.dispatch(
    StackActions.push({
      routeName: 'OneToOneChatScreen',
      params: {
        userId: user.id,
        username: user.username,
        headerTitle: user.username,
        avatarUrl: user.avatarUrl,
      },
    }),
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.foreground }}>
        <Button
          title="Create group chat"
          color={theme.foreground}
          titleColor={theme.actionHero}
          titleStyle={{ alignSelf: 'flex-start' }}
          onPress={openGroupChatSheet}
        />
      </View>
      <UserSearch onUserPress={openOneToOneChat} />
    </View>
  );
};

const enhance = compose(
  withNavigation,
  withTheme,
);

export default enhance(CreateChatSheet);
