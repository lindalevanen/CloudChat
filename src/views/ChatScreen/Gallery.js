import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

import { withTheme } from '../../components/ThemedWrapper';
import OpenImageWrapper from '../../components/OpenImageWrapper';

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const ImageThumb = () => {
  return (
    <View />
  );
};

const Gallery = ({
  navigation,
}) => {
  const {
    chatId,
  } = navigation.state.params;

  return (
    <FlatList
      contentContainerStyle={styles.list}
    >
      {}
    </FlatList>
  );
};

const populates = [{ child: 'members', root: 'users', populateByKey: true }];

const mapStateToProps = ({ firebase, settings }, { navigation }) => ({
  chatMetadata:
    populate(
      firebase,
      `chatMetadata/${navigation.state.params.chatId}`,
      populates,
    ),
  chatEvents:
    (isDraft && {})
    || populate(firebase, `chatEvents/${navigation.state.params.chatId}`),
  imageQuality: settings.imageQuality,
});

const enhance = compose(
  withTheme,
  firebaseConnect(({ navigation }) => [
    { path: `chatMetadata/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(Gallery);
