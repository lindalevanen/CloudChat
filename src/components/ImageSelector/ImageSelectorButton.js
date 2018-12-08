import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { withTheme } from '../ThemedWrapper';

const styles = theme => ({
  option: {
    backgroundColor: theme.backdrop,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  text: {
    color: theme.text2,
  },
});

const ImageSelectorButton = ({
  theme,
  onPress,
  name,
  icon,
  style,
}) => {
  const ownStyles = styles(theme);
  return (
    <TouchableOpacity style={[ownStyles.option, style]} onPress={onPress}>
      {icon}
      {/* <Text style={ownStyles.text}>{name}</Text> */}
    </TouchableOpacity>
  );
};

export default withTheme(ImageSelectorButton);
