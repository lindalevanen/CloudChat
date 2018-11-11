import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

import Button from '../../components/Button';
import { createChatRoom, addRoomToUsers } from '../../store/utils/firebase';

const ExampleChatInits = ({
  firebase,
  messages,
  profileUid
}) => {

  const initGroupChat = async (users, title) => {
    const chatRoomResult = await createChatRoom(
      firebase,
      true,
      users,
      title
    );
    //const roomId = chatRoomResult.path.pieces_[1] // hacky but does the job for now
    //await addRoomToUsers(firebase, roomId, users)
  }

  const initOne2OneChat = async (withUserId) => {
    const users = [profileUid, withUserId]
    const chatRoomResult = await createChatRoom(
      firebase,
      false,
      users,
    );
    //const roomId = chatRoomResult.path.pieces_[1]
    //await addRoomToUsers(firebase, roomId, users)
  }

  return (
    <View>
      <Button 
        onPress={() => initGroupChat([profileUid], "Great Room")}
        title="Init group chat">
      </Button>
       <Button 
        onPress={() => initOne2OneChat("GiA69eCArvRoHYXMxQUjR8eE0ns1")} // dummy id
        title="Init one2one chat">
      </Button>
    </View>
  )
};

export default compose(
  firebaseConnect(),
  connect(state => ({
    profileUid: state.firebase.auth.uid,
  })),
)(ExampleChatInits);
