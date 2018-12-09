import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Ionicons } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';

import { withTheme } from '../../../components/ThemedWrapper';
import { changeSetting } from '../../../store/settings/actions';

import { styles } from '../../../styles/form/style';

export const options = [
  {
    value: 'en',
    key: 'en',
    label: 'English',
  },
  {
    value: 'it',
    key: 'it',
    label: 'Italian',
  },
  {
    value: 'es',
    key: 'es',
    label: 'Spanish',
  },
  {
    value: 'hi',
    key: 'hi',
    label: 'Hindi',
  },
  {
    value: 'fi',
    key: 'fi',
    label: 'Finnish',
  },
];


const LanguageSetting = ({ theme, messageLanguage, setMessageLanguage }) => {
  const style = styles(theme);
  return (
    <View style={[style.setting, style.container, styles.panel]}>
      <View style={style.settingTitle}>
        <Ionicons style={style.settingIcon} name="ios-globe" size={24} color="deepskyblue" />
        <Text style={[style.text]}>Message translations</Text>
      </View>
      <Picker
        placeholderTextColor={theme.inputPlaceholder}
        items={options}
        value={messageLanguage}
        onValueChange={setMessageLanguage}
        placeholder={{ value: null, label: 'Original' }}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  messageLanguage: state.settings.messageLanguage,
});

const mapDispatchToProps = dispatch => ({
  setMessageLanguage: value => dispatch(changeSetting('messageLanguage', value)),
});

const enhance = compose(
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
);

export default enhance(LanguageSetting);
