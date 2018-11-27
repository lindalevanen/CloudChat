import React from 'react';
import { View } from 'react-native';

import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

const MessageInput = ({
  messageString,
  setMessageString,
  sendMessage,
}) => (
  <View>
    <TextInput
      placeholder="Message"
      onChangeText={setMessageString}
      autoCorrect={false}
      autoCapitalize="none"
      value={messageString}
    />
    <Button title="Send" onPress={sendMessage} />
  </View>
);

export default MessageInput;
