import React from 'react';
import { withStateHandlers } from 'recompose';

import UserList from './index';

const SelectableUserList = ({
  selectedUserIds,
  toggleUserIdSelection,
  clearSelection,
  ...props
}) => (
  <UserList
    {...props}
    selection={selectedUserIds}
    onSelect={toggleUserIdSelection}
  />
);

const enhance = withStateHandlers(
  ({ initialSelectedUserIds = [] }) => ({
    selectedUserIds: initialSelectedUserIds,
  }),
  {
    toggleUserIdSelection: ({ selectedUserIds }, { onSelectionDone }) => (userId) => {
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
