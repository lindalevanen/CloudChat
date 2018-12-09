import React from 'react';
import { Text, View, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Image from 'react-native-image-progress';
import _map from 'lodash/map';
import _groupBy from 'lodash/groupBy';

import { withTheme } from '../ThemedWrapper';
import OpenImageWrapper from '../OpenImageWrapper';
import ImageWithQuality from '../ImageWithQuality';

const columnAmount = 3;
const imageMargin = 2;

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const mins = date.getMinutes();

  return day + '/' + (month + 1) + '/' + year + ' ' + hours + ':' + ((mins < 10) ? '0' + mins : mins);
};

const galleryStyles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
    flex: 1,
  },
});

const ImageGrid = ({
  imageMetadata,
  listType,
  theme,
}) => {
  const galleryStyle = galleryStyles(theme);
  const arr = _map(imageMetadata, (data, key) => ({
    ...data,
    key,
  }));
  const filteredArr = arr.filter(item => item.url != null);
  const reversedArr = filteredArr.reverse();
  const imageData = _map(reversedArr, data => ({
    url: data.url,
    sender: data.fileOwner ? data.fileOwner.username : '',
    time: formatDate(new Date(data.timeCreated)),
  }));
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / columnAmount;

  const groupedData = _groupBy(reversedArr, x => x.imageLabel);

  const finalGroups = {
    food: [],
    technology: [],
    screenshot: [],
    other: [],
  };

  Object.keys(groupedData).forEach((key) => {
    if (finalGroups[key]) {
      finalGroups[key] = (groupedData[key]);
    } else {
      finalGroups.other = (groupedData[key]);
    }
  });

  for(key in finalGroups) {
    const group = finalGroups[key];
    for(i in group) {
      const item = finalGroups[key][i]
      finalGroups[key][i] = ({
        url: item.url,
        sender: item.fileOwner ? item.fileOwner.username : '',
        time: formatDate(new Date(item.timeCreated)),
      })
    }
  }

  if (imageMetadata) {
    if (listType === 'date') {
      return (
        <View style={galleryStyle.container}>
          <FlatList
            style={{ margin: imageMargin }}
            keyExtractor={item => item.key}
            data={reversedArr}
            numColumns={columnAmount}
            renderItem={({ item, index }) => (
              item.url && (
                <OpenImageWrapper
                  imageData={imageData}
                  index={index}
                >
                  { typeof item.url === 'object' ? (
                    <ImageWithQuality
                      style={{
                        margin: imageMargin,
                        width: imageWidth - imageMargin * 2,
                        minHeight: imageWidth - imageMargin * 2,
                      }}
                      attachment={item.url}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.url }}
                      style={{
                        margin: imageMargin,
                        width: imageWidth - imageMargin * 2,
                        minHeight: imageWidth - imageMargin * 2,
                      }}
                    />
                  )}
                </OpenImageWrapper>
              )
            )}
          />
        </View>
      );
    } else if (listType === 'group') {
      return (
        <View>
          { _map(finalGroups, (data, key) => (
              <View
                key={key}
              >
                <Text style={{ color: theme.text1, padding: 10 }}>{key}</Text>
                <FlatList
                  style={{ margin: imageMargin }}
                  data={data}
                  keyExtractor={item => item.key}
                  numColumns={columnAmount}
                  renderItem={({ item, index }) => (
                    item.url && (
                      <OpenImageWrapper
                        imageData={finalGroups[key]}
                        index={index}
                      >
                        { typeof item.url === 'object' ? (
                          <ImageWithQuality
                            style={{
                              margin: imageMargin,
                              width: imageWidth - imageMargin * 2,
                              minHeight: imageWidth - imageMargin * 2,
                            }}
                            attachment={item.url}
                          />
                        ) : (
                          <Image
                            source={{ uri: item.url }}
                            style={{
                              margin: imageMargin,
                              width: imageWidth - imageMargin * 2,
                              minHeight: imageWidth - imageMargin * 2,
                            }}
                          />
                        )}
                      </OpenImageWrapper>
                    )
                  )}
                />
              </View>
            )) }
        </View>
      )
    }
  }
  return <View />;
};


const enhance = compose(
  withTheme,
  connect(),
);

export default enhance(ImageGrid);
