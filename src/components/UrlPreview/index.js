import React from 'react';
import { Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { compose } from 'recompose';

import { withTheme } from '../ThemedWrapper';

const styles = theme => ({
  container: {
    marginTop: 8,
  },
  wrapper: {
    marginLeft: 14,
  },
  quote: {
    position: 'absolute',
    width: 2,
    height: '100%',
    marginLeft: 4,
    backgroundColor: theme.quoteSeparator,
  },
  title: {
    top: -5,
    fontWeight: 'bold',
  },
  desc: {
    top: -5,
  },
});

const UrlPreview = ({
  theme,
  title,
  description = '',
  image = '',
  url,
}) => {
  const style = styles(theme);
  const desc = description.length > 150
    ? description.slice(0, 150) + "..."
    : description;
  return (
    <TouchableOpacity style={style.container} onPress={() => Linking.openURL(url)}>
      <View style={style.quote} />
      <View style={style.wrapper}>
        <Text style={style.title}>{title}</Text>
        {description !== '' &&
          <Text style={style.desc}>{desc}</Text>
        }
        {image !== '' &&
          <Image style={{ width: '100%', height: 160 }} source={{ uri: image }} />
        }
      </View>
    </TouchableOpacity>
  );
};

const enhance = compose(
  withTheme,
);

export default enhance(UrlPreview);
