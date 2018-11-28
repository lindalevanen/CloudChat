import React from 'react';
import { FlatList } from 'react-native';

import { withTheme } from '../../components/ThemedWrapper';
import Message from './Message';

const styles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
  },
  content: {
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
      style={themedStyle.container}
      data={messageList}
      keyExtractor={({ id }) => id}
      contentContainerStyle={[themedStyle.content, style]}
      ref={(ref) => {
        scrollerRef = ref;
      }}
      onContentSizeChange={() => {
        console.log('content size change');
        scrollerRef.scrollToEnd({ animated: true });
      }}
      // keyboardDismissMode="on-drag"
      renderItem={({ item }) => (
        <Message
          sender={{ id: item.sender, ...chat.members[item.sender] }}
          message={item}
        />
      )}
    />
  );
};

export default withTheme(MessageList);
