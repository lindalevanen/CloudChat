import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withStateHandlers } from 'recompose';
import _filter from 'lodash/filter';
import { Ionicons } from '@expo/vector-icons';

import { styles as formStyles } from '../../styles/form/style';
import UserList from './index';

const usersToRender = (users, selectedUserIds) => {
  if (users && selectedUserIds.length > 0) {
    return _filter(users, ({ id }) => selectedUserIds.includes(id));
  }
  return [];
};

const SelectableUserList = ({
  theme,
  selectedUserIds,
  toggleUserIdSelection,
  clearSelection,
  users,
  filteredUsers,
  ...props
}) => {
  const styles = formStyles(theme);
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, styles.panel, { flexDirection: 'row', flexWrap: 'wrap' }]}>
        {usersToRender(users, selectedUserIds).map(user => (
          <View
            key={user.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.actionHero,
              borderRadius: 8,
              padding: 2,
              paddingHorizontal: 6,
              margin: 4,
            }}
          >
            <Text style={{ color: 'white', marginRight: 4 }}>{user.username}</Text>
            <TouchableOpacity onPress={() => toggleUserIdSelection(user.id)}>
              <Ionicons size={14} color="white" name="ios-remove-circle" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <UserList
        {...props}
        users={filteredUsers}
        selection={selectedUserIds}
        onSelect={toggleUserIdSelection}
      />
    </View>
  );
};

const enhance = withStateHandlers(
  ({ initialSelectedUserIds = [] }) => ({
    selectedUserIds: initialSelectedUserIds,
  }),
  {
    toggleUserIdSelection: (
      { selectedUserIds },
      { onSelectionDone },
    ) => (userId) => {
      const newSelection = selectedUserIds.includes(userId)
        ? selectedUserIds.filter(id => id !== userId)
        : selectedUserIds.concat([userId]);
      onSelectionDone(newSelection);
      return {
        selectedUserIds: newSelection,
      };
    },
    clearSelection: () => () => ({
      selectedUserIds: [],
    }),
  },
);

export default enhance(SelectableUserList);
