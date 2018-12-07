import React from 'react';
import { View, FlatList, Keyboard } from 'react-native';

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

class MessageList extends React.Component {
  itemOkToRender = (item) => {
    const { chatMetadata } = this.props;
    return (
      item && item.payload && item.payload.sender
      && chatMetadata && chatMetadata.members
      && chatMetadata.members[item.payload.sender]
    );
  }

  render() {
    const {
      theme, style, chatMetadata, messageList,
    } = this.props;
    const themedStyle = styles(theme);
    return (
      <View style={[themedStyle.container, style]}>
        {messageList.length === 0 ? (
          <EmptyPlaceholder text="No messages yet" />
        ) : (
          <FlatList
            inverted
            data={messageList.reverse()}
            keyExtractor={({ id }) => id}
            contentContainerStyle={themedStyle.content}
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => (
              this.itemOkToRender(item) && (
                <Message
                  sender={{
                    id: item.payload.sender,
                    ...chatMetadata.members[item.payload.sender],
                  }}
                  message={item}
                />
              )
            )}
          />
        )}
      </View>
    );
  }
}

export default withTheme(MessageList);
