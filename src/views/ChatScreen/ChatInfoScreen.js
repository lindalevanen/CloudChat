import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';
import _map from 'lodash/map';

import { withTheme } from '../../components/ThemedWrapper';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { styles } from '../../styles/form/style';
import UserList from '../../components/UserList';
import { leaveChat } from '../../store/utils/firebase';


const infoStyles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
    flex: 1,
  },
  section: {
    backgroundColor: theme.foreground,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
  },
  topContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  profileText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text1,
  },
});

const openAddUserScreen = navigation => navigation.dispatch(
  StackActions.push({
    routeName: 'AddUsersScreen',
    params: {
      chatId: navigation.state.params.chatId,
    },
  }),
);

const ChatInfoScreen = ({
  firebase, theme, chatMetadata, profileUid, navigation,
}) => {
  const style = styles(theme);
  const infoStyle = infoStyles(theme);

  const leaveRoom = async () => {
    navigation.dispatch(StackActions.popToTop());
    await leaveChat(
      firebase,
      navigation.state.params.chatId,
      profileUid,
    );
  };

  const navigateToGallery = () => {
    navigation.dispatch(StackActions.push({
      routeName: 'GalleryScreen',
      params: {
        chatId: navigation.state.params.chatId,
      },
    }));
  };

  const addUserToRoom = () => {
    openAddUserScreen(navigation);
  };

  if (!chatMetadata || !chatMetadata.members) { // without this the app crashes on leaving group
    return <View />;
  }

  return (
    <ScrollView style={style.view}>
      <View style={[infoStyle.topContainer, style.panel]}>
        <Avatar url={chatMetadata.avatarUrl} username={chatMetadata.title} />
        <View>
          <Text
            style={[
              infoStyle.profileText,
              { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
            ]}
          >
            {chatMetadata.title}
          </Text>
          <Text style={[infoStyle.profileText, { marginBottom: 10 }]}>
            {`${Object.keys(chatMetadata.members).length} members`}
          </Text>
        </View>
      </View>
      <View style={[style.section, style.panel]}>
        <Button
          title="Chat gallery"
          titleStyle={{ alignSelf: 'flex-start' }}
          color="transparent"
          onPress={() => navigateToGallery()}
          titleColor={theme.actionPrimary}
        />
      </View>
      <View style={[style.section, style.panel]}>
        <UserList
          scrollEnabled={false}
          users={_map(chatMetadata.members, (user, id) => ({ id, ...user }))}
        />
        <Button
          title="Add users"
          titleStyle={{ alignSelf: 'flex-start' }}
          color="transparent"
          titleColor={theme.actionPrimary}
          onPress={addUserToRoom}
        />
      </View>
      <View style={[style.section, style.panel]}>
        <Button
          title="Leave group"
          titleStyle={{ alignSelf: 'flex-start' }}
          color="transparent"
          titleColor={theme.actionHero}
          onPress={leaveRoom}
        />
      </View>
    </ScrollView>
  );
};

const populates = [{ child: 'members', root: 'users', populateByKey: true }];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chatMetadata: populate(firebase, `chatMetadata/${navigation.state.params.chatId}`, populates),
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  withTheme,
  withNavigation,
  firebaseConnect(({ navigation }) => [
    { path: `chatMetadata/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(ChatInfoScreen);
