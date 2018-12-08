import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, FlatList, StyleSheet, SectionList } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import _map from 'lodash/map';
import Picker from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

import { withTheme } from '../../components/ThemedWrapper';
import OpenImageWrapper from '../../components/OpenImageWrapper';
import { styles } from '../../styles/form/style';
import ImageGrid from '../../components/ImageGrid';


const columnAmount = 3;
const imageMargin = 2;

// TODO: get the thumbnail url (just add _thumb in the filename part in the url)
const thumbOf = url => url;

const galleryStyles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
    flex: 1,
  },
});

const Gallery = ({
  imageMetadata,
  listType,
  setListType,
  theme,
}) => {
  const style = styles(theme);
  const arr = _map(imageMetadata, (data, key) => ({
    ...data,
    key,
  }));
  const imageData = _map(arr, data => ({
    url: data.url,
    sender: data.fileOwner ? data.fileOwner.username : '',
    time: (new Date(data.timeCreated).toLocaleDateString()),
  }));
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / columnAmount;
  if (imageMetadata) {
    return (
      <View>
        <View style={style.settingTitle}>
          <Ionicons style={style.settingIcon} name="ios-globe" size={24} color="deepskyblue" />
          <Text style={[style.text]}>Sort by:</Text>
        </View>
        <Picker
          placeholderTextColor={theme.inputPlaceholder}
          items={options}
          useNativeAndroidPickerStyle={false}
          value={listType}
          onValueChange={setListType}
          placeholder={{ value: null, label: 'Original' }}
        />
        
      </View>
    );
  }
  return <View />;
};

const populates = [{ child: 'fileOwner', root: 'users' }];

const mapStateToProps = ({ firebase, settings }, { navigation }) => ({
  imageMetadata:
    populate(
      firebase,
      `storageMetadata/chatImages/${navigation.state.params.chatId}`,
      populates,
    ),
  imageQuality: settings.imageQuality,
});

const enhance = compose(
  withTheme,
  withState('listType', 'setListType', 'date'),
  firebaseConnect(({ navigation }) => [
    { path: `storageMetadata/chatImages/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(Gallery);
