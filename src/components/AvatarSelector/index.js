import React from 'react';
import { Text, View } from 'react-native';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';

import { uploadAvatar } from '../../store/utils/firebase';
import Avatar from '../Avatar';
import ImageSelector from '../ImageSelector';
import { withTheme } from '../ThemedWrapper';
import { styles } from '../../styles/form/style';

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
  imageQuality,
  theme,
}) => {
  const style = styles(theme);
  const handleFileReceived = async (data) => {
    const {
      uploadTaskSnapshot: { ref },
    } = await uploadAvatar(firebase, data.file, profileUid, imageQuality);
    const downloadUrl = await ref.getDownloadURL();
    await firebase.updateProfile({ avatarUrl: downloadUrl });
    setLoading(false);
  };
  return (
    <View style={[style.view]}>
      <View style={[style.container, style.panel, style.setting, { flexDirection: 'column', alignItems: 'center' }]}>
        <Avatar url={profile.avatarUrl} size={120} />
        {loading ? <Text>Uploading...</Text> : null}
      </View>
      <View style={[style.container, style.panel, style.setting]}>
        <Text style={style.text}>Pick from</Text>
        <ImageSelector
          setError={setError}
          setLoading={setLoading}
          onFileReceived={handleFileReceived}
          imageOptions={imgOptions}
          buttonStyle={{ marginLeft: 6 }}
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
