import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Ionicons } from '@expo/vector-icons';

import { withTheme } from '../../../components/ThemedWrapper';
import RadioButtons from '../../../components/RadioButtons';
import { changeSetting } from '../../../store/settings/actions';

import { styles } from '../../../styles/form/style';

const options = [
  {
    value: 'low',
    label: 'Low',
  },
  {
    value: 'high',
    label: 'High',
  },
  {
    value: 'original',
    label: 'Original',
  },
];

const ImageSettings = ({ theme, imageQuality, setImageQuality }) => {
  const style = styles(theme);
  return (
    <View style={[style.setting, style.container, styles.panel]}>
      <View style={style.settingTitle}>
        <Ionicons style={style.settingIcon} name="md-image" size={24} color="tomato" />
        <Text style={[style.text]}>Image quality</Text>
      </View>
      <RadioButtons
        showLabels
        options={options}
        selectedValue={imageQuality}
        onChange={setImageQuality}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  imageQuality: state.settings.imageQuality,
});

const mapDispatchToProps = dispatch => ({
  setImageQuality: value => dispatch(changeSetting('imageQuality', value)),
});

const enhance = compose(
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
);

export default enhance(ImageSettings);
