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

const styles = theme => ({
  container: {
    marginTop: 18,
  },
  section: {
    padding: 10,
    backgroundColor: theme.foreground,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: theme.text1,
  },
});

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
    <View style={style.container}>
      <View style={[style.section, style.setting]}>
        <Text style={[style.title]}>Use dark theme</Text>
        <Switch value={useDarkTheme} onValueChange={setDarkMode} />
      </View>
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
