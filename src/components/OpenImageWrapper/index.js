import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ImagePicker, ImageManipulator, Permissions } from 'expo';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import urlToBlob from '../../store/utils/urlToBlob';
import Button from '../Button';
import { withTheme } from '../ThemedWrapper';
import { styles } from '../../styles/form/style';

const style = theme => ({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
  },
});

const OpenImageWrapper = ({
  imageUrl,
  children,
  modalOpen,
  setModalOpen,
}) => {
  const images = [{
    url: imageUrl,
  }];
  return (
    <TouchableOpacity
      onPress={() => setModalOpen(true)}
    >
      {children}
      <Modal visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ImageViewer imageUrls={images} />
      </Modal>
    </TouchableOpacity>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  profileUid: state.firebase.auth.uid,
  imageQuality: state.settings.imageQuality,
});

const enhancer = compose(
  withTheme,
  withState('modalOpen', 'setModalOpen', false),
  firebaseConnect(),
  connect(mapStateToProps),
);

export default enhancer(OpenImageWrapper);
