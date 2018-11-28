import React from 'react';
import { Text, View } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const EmptyPlaceholder = ({ theme, text }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ color: theme.text2, fontSize: 20 }}>
      {text}
    </Text>
  </View>
);

export default withTheme(EmptyPlaceholder);
