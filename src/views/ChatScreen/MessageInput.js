import React from 'react';
import { View } from 'react-native';

import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    backgroundColor: theme.foreground,
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
  },
});

const MessageInput = ({
  theme,
  messageString,
  setMessageString,
  sendMessage,
}) => {
  const style = styles(theme);
  return (
    <View style={style.container}>
      <TextInput
        style={style.input}
        placeholder="Message"
        onChangeText={setMessageString}
        autoCorrect={false}
        autoCapitalize="none"
        value={messageString}
      />
      <Button style={style.button} title="Send" onPress={sendMessage} />
    </View>
  );
};

export default withTheme(MessageInput);
