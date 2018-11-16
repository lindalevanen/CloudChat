import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
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
    color: theme.text1,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

const User = ({
  theme, user, selectable, onSelect, isSelected, onPress,
}) => {
  const style = styles(theme);
  const onPressedAction = () => {
    if (onSelect) {
      onSelect(user.id);
    } else if (onPress) {
      onPress(user.id);
    } else {
      // open user profile
      console.log(`open profile ${user.id}`);
    }
  };
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPressedAction}>
      <View style={style.container}>
        <Avatar url={user.avatarUrl} username={user.username} size={40} />
        <View style={style.nameContainer}>
          <Text style={style.text}>{user.username}</Text>
          {selectable && isSelected(user.id) ? (
            <Ionicons name="md-checkmark-circle" color={theme.switchActive} size={24} />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(User);
