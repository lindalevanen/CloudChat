import React from 'react';
import {
  Text, View,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';

import { withTheme } from '../../../components/ThemedWrapper';
import Switch from '../../../components/Switch';
import { changeSetting } from '../../../store/settings/actions';
import { styles } from '../../../styles/form/style';

const ThemeSettings = ({
  theme,
  useDarkTheme,
  setDarkThemeAction,
  navigation,
}) => {
  const setDarkMode = (value) => {
    setDarkThemeAction(value);
    navigation.setParams({ useDarkTheme: value });
  };
  const style = styles(theme);
  return (
    <View style={[style.setting, style.container, styles.panel]}>
      <Text style={[style.text]}>Use dark theme</Text>
      <Switch value={useDarkTheme} onValueChange={setDarkMode} />
    </View>
  );
};

const mapStateToProps = state => ({
  useDarkTheme: state.settings.useDarkTheme,
});

const mapDispatchToProps = dispatch => ({
  setDarkThemeAction: value => dispatch(changeSetting('useDarkTheme', value)),
});

const enhance = compose(
  withTheme,
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(ThemeSettings);
