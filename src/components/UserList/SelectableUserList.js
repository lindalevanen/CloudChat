import React from 'react';
import { View } from 'react-native';
import { withStateHandlers } from 'recompose';

import Button from '../Button';
import UserList from './index';

const SelectableUserList = ({
  selectedUserIds,
  toggleUserIdSelection,
  clearSelection,
  onSelectionDone,
  ...props
}) => (
  <View>
    <UserList
      {...props}
      selection={selectedUserIds}
      onSelect={toggleUserIdSelection}
    />
    <Button title="clear" onPress={clearSelection} />
    <Button title="confirm" onPress={() => onSelectionDone(selectedUserIds)} />
  </View>
);

const enhance = withStateHandlers(
  ({ initialSelectedUserIds = [] }) => ({
    selectedUserIds: initialSelectedUserIds,
  }),
  {
    toggleUserIdSelection: ({ selectedUserIds }) => userId => ({
      selectedUserIds:
          selectedUserIds.includes(userId)
            ? selectedUserIds.filter(id => id !== userId)
            : selectedUserIds.concat([userId]),
    }),
    clearSelection: () => () => ({
      selectedUserIds: [],
    }),
  },
);

export default enhance(SelectableUserList);
