import React from 'react';
import {
  Text, View, TouchableOpacity, Modal, Dimensions, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Circle } from 'react-native-progress';
import { withState, compose } from 'recompose';
import _map from 'lodash/map';

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
  modal: {
    backgroundColor: 'red',
    opacity: 0.4,
  },
  modalHeader: {
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 20,
    color: theme.text1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#0000002e',
  },
  modalContent: {
    position: 'absolute',
    marginTop: Dimensions.get('window').height / 5,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: theme.foreground,
    padding: 10,
    borderRadius: 10,
  },
  translationItem: {
    marginTop: 4,
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: theme.messageBubble,
    borderRadius: 8,
    borderTopLeftRadius: 2,
    alignSelf: 'flex-start',
  },
  text: {
    color: theme.text1,
  },
});

const TranslationViewerModal = ({
  theme,
  styles,
  original,
  translations,
  close,
  ...props
}) => (translations && !translations.loading ? (
  <Modal
    style={styles.modal}
    {...props}
    onRequestClose={close}
    supportedOrientations={[
      'portrait',
      'portrait-upside-down',
      'landscape',
      'landscape-left',
      'landscape-right',
    ]}
    animationType="slide"
    transparent
  >
    <TouchableOpacity style={styles.modalBackdrop} onPress={close} />
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Translations</Text>
      </View>
      <View style={{ backgroundColor: theme.ownMessage, marginBottom: 6 }}>
        <Text style={[styles.text]}>Original message:</Text>
        <Text style={styles.text}>{original}</Text>
      </View>
      <ScrollView>
        {_map(translations, (value, key) => (
          <View key={key} style={styles.translationItem}>
            <Text style={[styles.text, { fontStyle: 'italic' }]}>
              {`${languages.find(val => val.key === key).label}:`}
            </Text>
            <Text style={styles.text}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </Modal>
) : null);

const TextWithTranslation = ({
  theme,
  style,
  language,
  payload,
  loading,
  body,
  modalOpen,
  setModalOpen,
}) => {
  const styles = themedStyles(theme);
  return (
    <View>
      <Text style={style}>{body}</Text>
      {language ? (
        <>
          <TouchableOpacity
            style={styles.footer}
            onPress={() => setModalOpen(true)}
          >
            {!loading ? (
              <Ionicons name="ios-globe" size={12} color="white" />
            ) : (
              <Circle indeterminate size={12} color="white" />
            )}
            <Text style={[style, { fontSize: 11, marginLeft: 4 }]}>
              {language}
            </Text>
          </TouchableOpacity>
          <TranslationViewerModal
            theme={theme}
            styles={styles}
            original={payload.body}
            translations={payload.translations}
            visible={modalOpen}
            close={() => setModalOpen(false)}
          />
        </>
      ) : null}
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

const enhance = compose(
  withState('modalOpen', 'setModalOpen', false),
  connect(mapStateToProps),
);

export default enhance(TextWithTranslation);
