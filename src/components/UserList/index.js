import React from 'react';
import { FlatList } from 'react-native';
import User from '../User';

const UserList = ({
  users, selection, onSelect, onUserPress,
}) => (
  <FlatList
    data={users}
    keyExtractor={({ id }) => id}
    extraData={selection}
    renderItem={({ item }) => (
      <User
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
