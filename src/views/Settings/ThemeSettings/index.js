import React from 'react';
import {
  Text, View, Switch, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';

import { changeSetting } from '../../../store/settings/actions';

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  section: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  dark: {
    backgroundColor: '#191B2C',
    borderColor: '#0E0E19',
  },
  darkText: {
    color: '#FAFAFA',
  },
});

const ThemeSettings = ({
  useDarkTheme,
  setDarkThemeAction,
  navigation,
}) => {
  const setDarkMode = (value) => {
    setDarkThemeAction(value);
    navigation.setParams({ useDarkTheme: value });
  };
  const switchStyleProps = {
    trackColor: { false: undefined, true: '#6970B9' },
  };
  return (
    <View style={styles.container}>
      <View style={[styles.section, styles.setting, useDarkTheme && styles.dark]}>
        <Text style={[styles.title, useDarkTheme && styles.darkText]}>Use dark theme</Text>
        <Switch value={useDarkTheme} onValueChange={setDarkMode} {...switchStyleProps} />
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
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(ThemeSettings);
