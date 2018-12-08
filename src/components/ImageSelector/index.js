import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ImagePicker, ImageManipulator, Permissions } from 'expo';
import { compose } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import urlToBlob from '../../store/utils/urlToBlob';
import Button from '../Button';
import { withTheme } from '../ThemedWrapper';
import { styles } from '../../styles/form/style';

const resolutions = {
  low: {
    width: 640,
    height: 480,
  },
  high: {
    width: 1280,
    height: 960,
  },
};

const ImageSelector = ({
  setLoading,
  setError,
  imageQuality,
  imageOptions,
  onFileReceived,
  theme,
  buttonStyle,
}) => {
  const style = styles(theme);
  const resizeImage = async (originalUri, resolution) => {
    const { width, height } = resolution;
    const actions = [{
      resize: {
        width,
        height,
      },
    }];
    const saveOptions = {
      format: 'jpeg',
    };
    const resizedResult = await ImageManipulator.manipulateAsync(originalUri, actions, saveOptions);
    const { uri } = resizedResult;
    return uri;
  };
  const handleResult = async (result) => {
    if (!result.cancelled) {
      setLoading(true);
      const { uri } = result;
      const resolution = resolutions[imageQuality];
      const finalUri = (resolution) ? await resizeImage(uri, resolution) : uri;
      const file = await urlToBlob(finalUri);
      const fileData = {
        file,
        width: result.width,
        height: result.height,
      };
      onFileReceived(fileData);
    }
  };
  const takeFromCamera = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL,
    );
    if (status !== 'granted') {
      setError('Permission to access images not granted');
    } else {
      handleResult(await ImagePicker.launchCameraAsync(imageOptions));
    }
  };
  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      setError('Permission to access images not granted');
    } else {
      handleResult(await ImagePicker.launchImageLibraryAsync(imageOptions));
    }
  };
  return (
    <View style={{ flexDirection: 'row' }}>
      <Button style={buttonStyle} color="transparent" titleColor={theme.actionHero} title="Camera" onPress={takeFromCamera} />
      <Button style={buttonStyle} color="transparent" titleColor={theme.actionHero} title="Gallery" onPress={pickImage} />
    </View>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  profileUid: state.firebase.auth.uid,
  imageQuality: state.settings.imageQuality,
});

const enhancer = compose(
  withTheme,
  firebaseConnect(),
  connect(mapStateToProps),
);

export default enhancer(ImageSelector);
