import React from 'react';
import { TouchableOpacity } from 'react-native';

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
  icon,
  style,
}) => {
  const ownStyles = styles(theme);
  return (
    <TouchableOpacity style={[ownStyles.option, style]} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default withTheme(ImageSelectorButton);
