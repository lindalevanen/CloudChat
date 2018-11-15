import React from 'react';
import { FlatList } from 'react-native';
import User from '../User';

const UserList = ({
  theme, users, selection, onSelect, onUserPress,
}) => (
  <FlatList
    data={users}
    keyExtractor={({ id }) => id}
    extraData={selection}
    renderItem={({ item }) => (
      <User
        theme={theme}
        onPress={onUserPress}
        selectable={selection !== undefined}
        onSelect={onSelect}
        isSelected={() => selection.includes(item.id)}
        user={item}
      />
    )}
  />
);

export default UserList;
