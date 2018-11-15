import React from 'react';
import { Text, View } from 'react-native';

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
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: theme.text1,
  },
});

const User = ({
  theme,
  user,
}) => {
  const style = styles(theme);
  return (
    <View style={style.container}>
      <Avatar url={user.avatarUrl} />
      <Text style={style.text}>{user.username}</Text>
    </View>
  );
};

export default User;
