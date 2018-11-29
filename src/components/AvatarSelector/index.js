import React from 'react';
import { Text, View } from 'react-native';
import { ImagePicker, ImageManipulator, Permissions } from 'expo';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import { uploadAvatar } from '../../store/utils/firebase';
import urlToBlob from '../../store/utils/urlToBlob';
import Avatar from '../Avatar';
import Button from '../Button';
import ImageSelector from '../ImageSelector'
import { withTheme } from '../ThemedWrapper';
import { styles } from '../../styles/form/style';

const imgOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  exif: false,
};

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

const AvatarSelector = ({
  firebase,
  profile,
  profileUid,
  loading,
  setLoading,
  error,
  setError,
  imageQuality,
  theme,
}) => {
  const style = styles(theme);
  /*const resizeImage = async (originalUri, resolution) => {
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
  };*/
  /*const handleResult = async (result) => {
    if (!result.cancelled) {
      setLoading(true);
      const { uri } = result;
      const resolution = resolutions[imageQuality];
      const finalUri = (resolution) ? await resizeImage(uri, resolution) : uri;
      const file = await urlToBlob(finalUri);
      const {
        uploadTaskSnapshot: { ref },
      } = await uploadAvatar(firebase, file, profileUid, imageQuality);
      const downloadUrl = await ref.getDownloadURL();
      await firebase.updateProfile({ avatarUrl: downloadUrl });
      setLoading(false);
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
      handleResult(await ImagePicker.launchCameraAsync(imgOptions));
    }
  };
  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      setError('Permission to access images not granted');
    } else {
      handleResult(await ImagePicker.launchImageLibraryAsync(imgOptions));
    }
  };*/

  const handleFileReceived = async (file) => {
    const {
      uploadTaskSnapshot: { ref },
    } = await uploadAvatar(firebase, file, profileUid, imageQuality);
    const downloadUrl = await ref.getDownloadURL();
    await firebase.updateProfile({ avatarUrl: downloadUrl });
    setLoading(false);
  }
  return (
    <View style={[style.view]}>
      <View style={[style.container, style.setting]}>
        <Text>{error}</Text>
        <Avatar url={profile.avatarUrl} size={120} />
        <ImageSelector
          setError={setError}
          setLoading={setLoading}
          onFileReceived={handleFileReceived}
        />
      </View>
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
  withState('error', 'setError', null),
  withState('loading', 'setLoading', false),
  connect(mapStateToProps),
);

export default enhancer(AvatarSelector);
