import React from 'react';
import { View } from 'react-native';
import { ImagePicker, ImageManipulator, Permissions } from 'expo';
import { compose } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import urlToBlob from '../../store/utils/urlToBlob';
import Button from '../Button';
import { withTheme } from '../ThemedWrapper';
import ImageSelectorButton from './ImageSelectorButton';

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

const getStyles = theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
});


function getLimitingFactor(width, height) {
  const limitingFactor = width > height ? 'width' : 'height';
  return limitingFactor;
}

const ImageSelector = ({
  setLoading,
  setError,
  imageQuality,
  imageOptions,
  onFileReceived,
  theme,
  buttonStyle,
  expanded = false,
}) => {
  const styles = getStyles(theme);
  const resizeImage = async (originalUri, resolution) => {
    const { width, height } = resolution;
    const actions = [
      {
        resize: {
          width,
          height,
        },
      },
    ];
    const saveOptions = {
      format: 'jpeg',
    };
    const resizedResult = await ImageManipulator.manipulateAsync(
      originalUri,
      actions,
      saveOptions,
    );
    const { uri } = resizedResult;
    return uri;
  };
  const handleResult = async (result) => {
    if (!result.cancelled) {
      setLoading(true);
      const limitingFactor = getLimitingFactor(result.width, result.height);
      const LARGEST_DIMENSION_VALUE = 3000;
      const { uri } = result;
      let resolution = resolutions[imageQuality];
      const resoWithRatio = {};
      if (resolution && limitingFactor === 'width') {
        resoWithRatio.width = resolution.width;
      } else if (resolution) {
        resoWithRatio.height = resolution.height;
      } else if (result.width > LARGEST_DIMENSION_VALUE || result.height > LARGEST_DIMENSION_VALUE) {
        resolution = { imageTooBig: true };
        if (limitingFactor === 'width') {
          resoWithRatio.width = LARGEST_DIMENSION_VALUE;
        } else {
          resoWithRatio.height = LARGEST_DIMENSION_VALUE;
        }
      }
      console.log(resoWithRatio);
      const finalUri = resolution ? await resizeImage(uri, resoWithRatio) : uri;
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
  return expanded ? (
    <View style={styles.container}>
      <ImageSelectorButton
        onPress={takeFromCamera}
        icon={<Ionicons name="ios-camera" color={theme.actionHero} size={30} />}
      />
      <ImageSelectorButton
        onPress={pickImage}
        style={{ marginLeft: 0 }}
        icon={<Ionicons name="ios-photos" color={theme.actionHero} size={30} />}
      />
    </View>
  ) : (
    <View style={{ flexDirection: 'row' }}>
      <Button
        style={buttonStyle}
        color="transparent"
        titleColor={theme.actionHero}
        title="Camera"
        onPress={takeFromCamera}
      />
      <Button
        style={buttonStyle}
        color="transparent"
        titleColor={theme.actionHero}
        title="Gallery"
        onPress={pickImage}
      />
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
