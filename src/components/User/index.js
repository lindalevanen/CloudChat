import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { withNavigation, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Ionicons } from '@expo/vector-icons';

import { withTheme } from '../ThemedWrapper';
import Avatar from '../Avatar';

const styles = theme => ({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: theme.foreground,
    borderWidth: 0.3,
    borderColor: theme.separator,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

const openUserInfoScreen = (navigation, userId, username) => navigation.dispatch(
  StackActions.push({
    routeName: 'UserInfoScreen',
    params: {
      headerTitle: username,
      userId,
    },
  }),
);

const User = ({
  theme,
  navigation,
  user,
  selectable,
  onSelect,
  isSelected,
  onPress,
  profileUid,
}) => {
  const style = styles(theme);
  const isOwnProfile = profileUid === user.id;
  const onPressedAction = () => {
    if (onSelect) {
      onSelect(user.id);
    } else if (onPress) {
      onPress(user);
    } else if (!isOwnProfile) {
      openUserInfoScreen(navigation, user.id, user.username);
    }
  };
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPressedAction}>
      <View style={style.container}>
        <Avatar url={user.avatarUrl} username={user.username} size={40} />
        <View style={style.nameContainer}>
          <Text style={[style.text, { color: isOwnProfile ? theme.actionPrimary : theme.text1 }]}>{user.username}</Text>
          {selectable && isSelected(user.id) ? (
            <Ionicons
              name="md-checkmark-circle"
              color={theme.switchActive}
              size={24}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const enhance = compose(
  withNavigation,
  withTheme,
  connect(state => ({ profileUid: state.firebase.auth.uid })),
);

export default enhance(User);
