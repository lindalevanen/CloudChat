import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { withTheme } from '../ThemedWrapper';

const styles = theme => ({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  checkbox: {
    marginHorizontal: 5,
  },
  text: {
    color: theme.text2,
  },
});

const Checkbox = ({
  theme, selected, onPress, style, color,
}) => {
  const themedStyle = styles(theme);
  const colorToUse = color || theme.actionHero;
  return (
    <TouchableOpacity onPress={onPress} style={[themedStyle.checkbox, style]}>
      <MaterialCommunityIcons
        color={colorToUse}
        name={
        selected ? 'check-circle' : 'checkbox-blank-circle-outline'
      }
        size="24"
      />
    </TouchableOpacity>
  );
};

const onOptionSelected = (value, setSelected) => () => setSelected(value);

const VerticalButtons = ({
  theme,
  style,
  options,
  selectedValue,
  onChange,
  showLabels = false,
}) => {
  const themedStyle = styles(theme);
  return (
    <View style={themedStyle.container}>
      <View style={[style, themedStyle.buttonContainer]}>
        {options.map(({ label, value }) => (
          <Checkbox
            theme={theme}
            selected={selectedValue === value}
            onPress={onOptionSelected(value, onChange)}
            title={label}
          />
        ))}
      </View>
      {showLabels ? (
        <Text style={[themedStyle.text]}>{selectedValue}</Text>
      ) : null}
    </View>
  );
};

export default withTheme(VerticalButtons);
