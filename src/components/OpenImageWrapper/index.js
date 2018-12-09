import React from 'react';
import { TouchableOpacity, Modal, View, Text, Dimensions } from 'react-native';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import _map from 'lodash/map';

import ImageViewer from 'react-native-image-zoom-viewer';

import { withTheme } from '../ThemedWrapper';

const styles = {
  footerWrapper: {
    paddingTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  footerText: {
    color: 'white',
    marginLeft: 10,
    paddingBottom: 5,
  },
};

const footer = (sender, time, width) => (
  <View style={[styles.footerWrapper, { width }]}>
    <Text style={styles.footerText}>{sender}</Text>
    <Text style={styles.footerText}>{time}</Text>
  </View>
);

class OpenImageWrapper extends React.Component {
  componentDidMount() {
    if(this.props.index) {
      this.props.setIndex(this.props.index);
    }
  }

  render() {
    const {
      imageData,
      children,
      modalOpen,
      currentIndex,
      setModalOpen,
      setIndex,
    } = this.props
    
    const urls = _map(imageData, data => ({ url: data.url && data.url.downloadUrl ? data.url.downloadUrl : data.url }));
    const width = Dimensions.get('window').width;
    return (
      <TouchableOpacity
        onPress={() => setModalOpen(true)}
      >
        {children}
        <Modal visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
          <ImageViewer
            imageUrls={urls}
            onChange={i => setIndex(i)}
            index={currentIndex}
            onSwipeDown={() => { setModalOpen(false); }}
            onSave={() => console.log("TODO: Implement saving")}
            enableSwipeDown
            renderFooter={() => footer(imageData[currentIndex].sender, imageData[currentIndex].time, width)}
          />
        </Modal>
      </TouchableOpacity>
    );
  }
};

const enhancer = compose(
  withTheme,
  withState('currentIndex', 'setIndex', 0),
  withState('modalOpen', 'setModalOpen', false),
  connect(),
);

export default enhancer(OpenImageWrapper);
