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
  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Create group chat"
        color={theme.foreground}
        titleColor={theme.actionHero}
        titleStyle={{ alignSelf: 'flex-start' }}
        onPress={openGroupChatSheet}
      />
      <UserSearch
        onUserPress={id => console.log(`start chat with person ${id}`)}
      />
    </View>
  );
};

const enhance = compose(
  withNavigation,
  withTheme,
);

export default enhance(CreateChatSheet);
