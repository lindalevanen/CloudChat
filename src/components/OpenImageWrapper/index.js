import React from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { FileSystem, MediaLibrary } from 'expo';

import ImageViewer from 'react-native-image-zoom-viewer';

import { withTheme } from '../ThemedWrapper';

const downloadImage = async (url) => {
  try {
    const saveFolder = `${FileSystem.documentDirectory}CloudChat`;
    const { exists } = await FileSystem.getInfoAsync(saveFolder);
    if (!exists) {
      await FileSystem.makeDirectoryAsync(saveFolder, { intermediates: true });
    }
    const fileName = 'tempfile';
    const saveTo = `${saveFolder}/${fileName}`;
    const { uri } = await FileSystem.downloadAsync(url, saveTo);
    const asset = await MediaLibrary.createAssetAsync(uri);
    const albumName = 'CloudChat';
    const { title } = await MediaLibrary.createAlbumAsync(albumName, asset);
    return title;
  } catch (error) {
    console.error(`Error downloading image ${error}`);
    return error;
  }
};


const OpenImageWrapper = ({
  imageUrl = '',
  attachment,
  children,
  modalOpen,
  index = 0,
  setModalOpen,
}) => {
  const images = [{
    url: (attachment && attachment.downloadUrl) ? attachment.downloadUrl : imageUrl,
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
          onSave={async (url) => {
            await downloadImage(url);
            setModalOpen(false);
          }}
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
