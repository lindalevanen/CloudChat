import React from 'react';
import {
  Text, View,
} from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { withNavigation } from 'react-navigation';

import { withTheme } from '../../../components/ThemedWrapper';
import VerticalButtons from '../../../components/VerticalButtons';
import { changeSetting } from '../../../store/settings/actions';
import { styles } from '../../../styles/form/style';

// Label for what is in the UI, value for the prefix for proper image in Firebase Storage
const data = [
  {
    label: 'Low',
  },
  {
    label: 'High',
  },
  {
    label: 'Original',
    selected: true,
  },
];

const ThemeSettings = ({
  theme,
  firebase,
  currentImageQuality,
}) => {
  const style = styles(theme);
  const onImageQualitySaved = async (buttons) => {
    try {
      const selected = buttons.find(b => b.selected);
      const qualitySelected = selected.value.toLowerCase();
      const imageQuality = (qualitySelected === 'original') ? '' : qualitySelected;
      // Update profile to firebase with firebaseConnect
      // (successful updates flow back to redux)
      await firebase.updateProfile({ imageQuality });
    } catch (e) {
      console.log(`ImageQuality change failed: ${e}`);
    }
  };
  // Originally select the proper quality from profile information
  const expectedLabel = (currentImageQuality) ? currentImageQuality.toLowerCase() : '';
  const expectedOption = data.find(d => d.label.toLowerCase() === expectedLabel);
  // Deselect old option and select right one
  if (expectedOption) {
    const currentOption = data.find(d => d.selected);
    if (currentOption) currentOption.selected = false;
    expectedOption.selected = true;
  }
  // Render settings
  return (
    <View style={[style.section, style.setting, style.container, style.panel]}>
      <Text style={[style.text]}>Image quality</Text>
      <VerticalButtons data={data} onPress={onImageQualitySaved} />
    </View>
  );
};

const mapStateToProps = state => ({
  currentImageQuality: state.firebase.profile.imageQuality,
});

const mapDispatchToProps = dispatch => ({
  setImageQualityAction: value => dispatch(changeSetting('imageQuality', value)),
});

const enhance = compose(
  withTheme,
  withNavigation,
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
  withState('imageQuality', 'setImageQuality', ({ imageQuality }) => imageQuality),
);

export default enhance(ThemeSettings);
