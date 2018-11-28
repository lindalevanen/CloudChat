import React from 'react';
import { View, FlatList } from 'react-native';

import { withTheme } from '../../components/ThemedWrapper';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';
import Message from './Message';

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backdrop,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

let scrollerRef;

const MessageList = ({
  theme, style, chatMetadata, messageList,
}) => {
  const themedStyle = styles(theme);
  return (
    <View style={[themedStyle.container, style]}>
      {messageList.length === 0 ? <EmptyPlaceholder text="No messages yet" />
        : (
          <FlatList
            data={messageList}
            keyExtractor={({ id }) => id}
            contentContainerStyle={themedStyle.content}
            ref={(ref) => {
              scrollerRef = ref;
            }}
            onContentSizeChange={() => {
              scrollerRef.scrollToEnd({ animated: true });
            }}
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => (
              <Message
                sender={{ id: item.payload.sender, ...chatMetadata.members[item.payload.sender] }}
                message={item}
              />
            )}
          />
        )
        }
    </View>
  );
};

export default withTheme(MessageList);
