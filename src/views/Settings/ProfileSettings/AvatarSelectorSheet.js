import React from 'react';
import { Text, View } from 'react-native';
import { compose } from 'recompose';

import AvatarSelector from '../../../components/AvatarSelector';
import { withTheme } from '../../../components/ThemedWrapper';

import { styles } from '../../../styles/form/style';

const AvatarSelectorSheet = ({
  theme,
}) => {
  const style = styles(theme);
  return (
    <View style={[style.view, style.container, style.section]}>
      <AvatarSelector />
    </View>
  );
};

const enhance = compose(
  withTheme,
);

export default enhance(AvatarSelectorSheet);
