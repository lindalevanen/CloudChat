import React from 'react';
import { FlatList } from 'react-native';

import { withTheme } from '../../components/ThemedWrapper';
import Message from './Message';

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backdrop,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

let scrollerRef;

const MessageList = ({
  theme, style, chat, messageList,
}) => {
  const themedStyle = styles(theme);
  return (
    <FlatList
      data={messageList}
      keyExtractor={({ id }) => id}
      style={[themedStyle.container, style]}
      ref={(ref) => { scrollerRef = ref; }}
      onContentSizeChange={() => {
        scrollerRef.scrollToEnd({ animated: true });
      }}
      renderItem={({ item }) => (
        <Message sender={{ id: item.sender, ...chat.members[item.sender] }} message={item} />
      )}
    />
  );
};

export default withTheme(MessageList);
