import React from 'react';
import { Text, View } from 'react-native';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import { uploadAvatar } from '../../store/utils/firebase';
import Avatar from '../Avatar';
import ImageSelector from '../ImageSelector';
import { withTheme } from '../ThemedWrapper';
import { styles } from '../../styles/form/style';

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
