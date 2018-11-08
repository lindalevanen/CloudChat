import React from 'react';
import {
  Text, View, Switch, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

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
});

const ThemeSettings = ({
  useDarkTheme,
  setDarkThemeAction,
}) => (
  <View style={styles.container}>
    <View style={[styles.section, styles.setting]}>
      <Text style={styles.title}>Use dark theme</Text>
      <Switch value={useDarkTheme} onValueChange={setDarkThemeAction} />
    </View>
  </View>
);

const mapStateToProps = state => ({
  useDarkTheme: state.settings.useDarkTheme,
});

const mapDispatchToProps = dispatch => ({
  setDarkThemeAction: value => dispatch(changeSetting('useDarkTheme', value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSettings);
