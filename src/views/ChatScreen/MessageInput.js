import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TextInput from '../../components/TextInput';
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
  button: {
    paddingRight: 10,
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 50,
    alignItems: 'center',
  },
});

const SendAction = ({ theme, style, sendMessage }) => (
  <TouchableOpacity
    style={style}
    onPress={sendMessage}
  >
    <Ionicons name="ios-send" color={theme.actionHero} size={30} />
  </TouchableOpacity>
);

const AttachAction = ({ theme, style, chooseFile }) => (
  <TouchableOpacity
    style={style}
    onPress={chooseFile}
  >
    <Ionicons name="ios-attach" color={theme.actionHero} size={30} />
  </TouchableOpacity>
);

const MessageInput = ({
  theme,
  messageString,
  setMessageString,
  sendMessage,
  chooseFile,
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
      {messageString.length > 0 ? (
        <SendAction theme={theme} style={style.button} sendMessage={sendMessage} />
      ) : (
        <AttachAction theme={theme} style={style.button} chooseFile={chooseFile} />
      )}
    </View>
  );
};

export default withTheme(MessageInput);
