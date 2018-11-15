import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const switchStyleProps = theme => ({
  trackColor: { false: undefined, true: theme.switchActive },
});

const Switch = ({
  theme,
  value,
  onValueChange,
  ...props
}) => (
  <RNSwitch value={value} onValueChange={onValueChange} {...switchStyleProps(theme)} {...props} />
);

export default withTheme(Switch);
