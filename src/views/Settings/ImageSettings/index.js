import React from 'react';
import {
  Text, View,
} from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';

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
  },
];

const ThemeSettings = ({
  theme,
  firebase,
  navigation,
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
      // Go back to the settings view with withNavigation
      // navigation.dispatch(StackActions.pop());
    } catch (e) {
      console.log(`ImageQuality change failed: ${e}`);
    }
  };
  return (
    <View style={[style.section, style.setting, style.container, style.panel]}>
      <Text style={[style.text]}>Image quality</Text>
      <VerticalButtons data={data} onPress={onImageQualitySaved} />
    </View>
  );
};

const mapStateToProps = state => ({
  imageQuality: state.settings.imageQuality,
});

const mapDispatchToProps = dispatch => ({
  setImageQualityAction: value => dispatch(changeSetting('imageQuality', value)),
});

const enhance = compose(
  withTheme,
  withNavigation,
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(ThemeSettings);
