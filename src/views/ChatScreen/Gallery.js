import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, FlatList, StyleSheet, SectionList, ScrollView } from 'react-native';
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

export const options = [
  {
    value: 'date',
    key: '0',
    label: 'Date',
  },
  {
    value: 'group',
    key: '1',
    label: 'Group',
  },
];

const galleryStyles = theme => ({
  text: {
    color: theme.text1,
    top: 8,
    right: 10,
    fontSize: 16,
  },
});

const Gallery = ({
  imageMetadata,
  listType,
  setListType,
  theme,
}) => {
  const style = styles(theme);
  const galleryStyle = galleryStyles(theme);
  const changeListType = (val) => {
    setListType(val);
  };

  if (imageMetadata) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.backdrop }}>
        <View style={[style.setting, style.container, styles.panel, { flex: 1 }]}>
          <View style={style.settingTitle}>
            <Text style={[style.text, { top: 5 }]}>Sort by:</Text>
          </View>
          <Picker
            items={options}
            style={{ inputIOS: galleryStyle.text, inputAndroid: galleryStyle.text }}
            useNativeAndroidPickerStyle={false}
            value={listType}
            onValueChange={changeListType}
          />
        </View>
        <ImageGrid
          imageMetadata={imageMetadata}
          listType={listType}
        />
      </ScrollView>
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
