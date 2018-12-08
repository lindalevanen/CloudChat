import React from 'react';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import placeholder from '../../../assets/placeholder.png';

class ImageWithQuality extends React.Component {
  state = {
    imageSource: placeholder,
    error: undefined,
  };

  componentDidMount() {
    const { firebase, imageRef } = this.props;
    firebase
      .storage()
      .ref(imageRef)
      .getDownloadURL()
      .then(uri => this.setState({
        imageSource: { uri, cache: 'force-cache' },
      }))
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
  }

  render() {
    const {
      style, attachment, imageQuality, imageRef, ...props
    } = this.props;
    const { imageSource, error } = this.state;
    return error ? null : (
      <Image
        {...props}
        style={style}
        imageStyle={[style, { resizeMode: 'center' }]}
        source={imageSource}
        indicator={ProgressBar}
        indicatorProps={{
          color: 'white',
        }}
      />
    );
  }
}

function constructRefPath(state, props) {
  const { imageQuality } = state.settings;
  const { attachment } = props;
  if (!attachment || !attachment.parentRefPath) {
    return '';
  }
  const { parentRefPath, filename } = attachment;
  const prefix = imageQuality === 'original' ? '' : `${imageQuality}_`;
  return `${parentRefPath}/${prefix}${filename}`;
}

const mapStateToProps = (state, props) => ({
  imageQuality: state.settings.imageQuality,
  imageRef: constructRefPath(state, props),
});

const enhance = compose(
  withFirebase,
  connect(mapStateToProps),
);

export default enhance(ImageWithQuality);
