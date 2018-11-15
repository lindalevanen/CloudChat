import React from 'react';
import { Text, View } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import { uploadAvatar } from '../../store/utils/firebase';
import urlToBlob from '../../store/utils/urlToBlob';
import Avatar from '../Avatar';
import Button from '../Button';

const imgOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  exif: false,
};

const AvatarSelector = ({
  firebase,
  profile,
  profileUid,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const handleResult = async (result) => {
    if (!result.cancelled) {
      setLoading(true);
      const { uri } = result;
      const file = await urlToBlob(uri);
      const {
        uploadTaskSnapshot: { ref },
      } = await uploadAvatar(firebase, file, profileUid);
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
  };
  return (
    <View>
      <Text>{loading ? 'loading' : 'ready'}</Text>
      <Text>{error}</Text>
      <Avatar url={profile.avatarUrl} size={120} />
      <Button title="take new" onPress={takeFromCamera} />
      <Button title="pick photo" onPress={pickImage} />
    </View>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  profileUid: state.firebase.auth.uid,
});

const enhancer = compose(
  firebaseConnect(),
  withState('error', 'setError', null),
  withState('loading', 'setLoading', false),
  connect(mapStateToProps),
);

export default enhancer(AvatarSelector);
