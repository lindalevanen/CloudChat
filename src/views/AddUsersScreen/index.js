import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';
import { updateRoomUsers } from '../../store/utils/firebase';
import UserSearch from '../../components/UserSearch';
import { styles as formStyles } from '../../styles/form/style';
import { withTheme } from '../../components/ThemedWrapper';

const AddUsersScreen = ({
  theme,
  navigation,
  firebase,
  setUserIds,
  userIds,
}) => {
  const onAddUsersPressed = async () => {
    const { chatId } = navigation.state.params;
    await updateRoomUsers(firebase, chatId, userIds);
    navigation.dispatch(StackActions.pop());
  };

  const formStyle = formStyles(theme);
  return (
    <SafeAreaView style={[formStyle.view]}>
      <UserSearch style={{ flex: 1 }} onSelectionDone={setUserIds} />
      <View style={[formStyle.container, formStyle.panel]}>
        <Button
          title="Add users"
          titleColor={theme.actionPrimary}
          titleStyle={{ alignSelf: 'flex-start' }}
          onPress={onAddUsersPressed}
        />
      </View>
    </SafeAreaView>
  );
};

const enhance = compose(
  withTheme,
  withNavigation,
  firebaseConnect(),
  withState('userIds', 'setUserIds', []),
);

export default enhance(AddUsersScreen);
