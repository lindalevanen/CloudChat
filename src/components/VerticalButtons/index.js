import React from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { withTheme } from '../ThemedWrapper';

const VerticalButtons = ({
  data,
  onPress,
}) => (
  <RadioGroup radioButtons={data} onPress={onPress} />
);

export default withTheme(VerticalButtons);
