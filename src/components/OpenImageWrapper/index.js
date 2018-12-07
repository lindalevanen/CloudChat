import React from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import ImageViewer from 'react-native-image-zoom-viewer';

import { withTheme } from '../ThemedWrapper';

const OpenImageWrapper = ({
  imageUrl,
  children,
  modalOpen,
  index = 0,
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
        <ImageViewer
          imageUrls={images}
          index={index}
          onSwipeDown={() => { setModalOpen(false); }}
          onSave={() => console.log("TODO: Implement saving")}
          enableSwipeDown
        />
      </Modal>
    </TouchableOpacity>
  );
};

const enhancer = compose(
  withTheme,
  withState('modalOpen', 'setModalOpen', false),
  connect(),
);

export default enhancer(OpenImageWrapper);
