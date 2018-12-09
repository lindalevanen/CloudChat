import React from 'react';
import { View } from 'react-native';
import ThemeSettings from '../ThemeSettings';
import ImageSettings from '../ImageSettings';
import LanguageSetting from '../LanguageSetting';

import { styles } from '../../../styles/form/style';

const GeneralSettings = ({ theme }) => {
  const style = styles(theme);
  return (
    <View style={[style.section, style.panel]}>
      <ThemeSettings theme={theme} />
      <ImageSettings theme={theme} />
      <LanguageSetting theme={theme} />
    </View>
  );
};

export default GeneralSettings;
