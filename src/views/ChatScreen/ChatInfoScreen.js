import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import _map from 'lodash/map';

import { withTheme } from '../../components/ThemedWrapper';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { styles } from '../../styles/form/style';
import UserList from '../../components/UserList';

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

const ChatInfoScreen = ({ theme, chat }) => {
  const style = styles(theme);
  const infoStyle = infoStyles(theme);
  return (
    <ScrollView style={style.view}>
      <View style={[infoStyle.topContainer, style.section]}>
        <Avatar url={chat.avatarUrl} username={chat.title} />
        <View>
          <Text
            style={[
              infoStyle.profileText,
              { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
            ]}
          >
            {chat.title}
          </Text>
          <Text style={[infoStyle.profileText, { marginBottom: 10 }]}>
            {`${Object.keys(chat.members).length} members`}
          </Text>
        </View>
      </View>
      <View style={style.section}>
        <Button
          title="Chat gallery"
          titleStyle={{ alignSelf: 'flex-start' }}
          color="transparent"
          titleColor={theme.actionPrimary}
        />
      </View>
      <View style={style.section}>
        <UserList
          scrollEnabled={false}
          users={_map(chat.members, (user, id) => ({ id, ...user }))}
        />
      </View>
      <View style={style.section}>
        <Button
          title="Leave group"
          titleStyle={{ alignSelf: 'flex-start' }}
          color="transparent"
          titleColor={theme.actionHero}
        />
      </View>
    </ScrollView>
  );
};

const populates = [{ child: 'members', root: 'users' }];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chat: populate(firebase, `chats/${navigation.state.params.chatId}`, populates),
});

const enhance = compose(
  withTheme,
  firebaseConnect(({ navigation }) => [
    { path: `chats/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(ChatInfoScreen);
