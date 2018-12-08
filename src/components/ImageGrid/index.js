import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, FlatList, StyleSheet, SectionList } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';
import _map from 'lodash/map';

import { withTheme } from '../ThemedWrapper';
import OpenImageWrapper from '../OpenImageWrapper';

const columnAmount = 3;
const imageMargin = 2;

// TODO: get the thumbnail url (just add _thumb in the filename part in the url)
const thumbOf = url => url;

const formatDate = (date) => {
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

const ImageGrid = ({
  imageMetadata,
  listType
}) => {
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
    if (listType === 'date') {
      return (
        <View>
          <FlatList
            style={{ margin: imageMargin }}
            data={arr}
            numColumns={columnAmount}
            renderItem={({ item, index }) => (
              item.name && item.url && (
                <OpenImageWrapper
                  imageData={imageData}
                  index={index}
                >
                  <Image
                    key={item.key}
                    source={{ uri: thumbOf(item.url) }}
                    style={{
                      margin: imageMargin,
                      width: imageWidth - imageMargin * 2,
                      minHeight: imageWidth - imageMargin * 2,
                      backgroundColor: '#CCC',
                    }}
                  />
                </OpenImageWrapper>
              )
            )}
          />
        </View>
      );
    } else if (listType === 'group') {
      return (
        <View>
          <FlatList
          style={{ margin: 7 }}
          data={arr}
          numColumns={columnAmount}
          renderItem={({ item, index }) => (
            item.name && item.url && (
            <OpenImageWrapper
              imageData={imageData}
              index={index}
            >
              <Image
                key={item.key}
                source={{ uri: thumbOf(item.url) }}
                style={{
                  margin: imageMargin,
                  width: imageWidth - imageMargin * 2,
                  minHeight: imageWidth - imageMargin * 2,
                  backgroundColor: '#CCC',
                }}
              />
            </OpenImageWrapper>
            )
          )}
          />
        </View>
      );
    }
  }
  return <View />;
};


const enhance = compose(
  withTheme,
  connect(),
);

export default enhance(Gallery);
