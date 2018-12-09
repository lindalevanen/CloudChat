import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Circle } from 'react-native-progress';

import { options as languages } from '../Settings/LanguageSetting';

const themedStyles = theme => ({
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 16,
    padding: 2,
    paddingHorizontal: 6,
  },
});

const TextWithTranslation = ({
  theme, style, language, loading, body,
}) => {
  const styles = themedStyles(theme);
  return (
    <View>
      <Text style={style}>{body}</Text>
      <View style={styles.footer}>
        {!loading ? <Ionicons name="ios-globe" size={12} color="white" />
          : <Circle indeterminate size={12} color="white" />
        }
        <Text style={[style, { fontSize: 11, marginLeft: 4 }]}>{language}</Text>
      </View>
    </View>
  );
};

function constructMessageBody(language, payload) {
  if (language && payload.translations && payload.translations[language]) {
    return payload.translations[language];
  }
  return payload.body;
}

function selectLabel(lang) {
  return languages && lang
    ? languages.find(({ value }) => value === lang).label
    : lang;
}

function areTranslationsLoading(payload) {
  return payload.translations && payload.translations.loading;
}

const mapStateToProps = (state, props) => ({
  language: selectLabel(state.settings.messageLanguage),
  loading: areTranslationsLoading(props.payload),
  body: constructMessageBody(state.settings.messageLanguage, props.payload),
});

export default connect(mapStateToProps)(TextWithTranslation);
