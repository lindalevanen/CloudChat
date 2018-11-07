import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';

import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Logo from '../../../assets/icon.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    marginBottom: 200,
  },
  logo: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
});

const LoginScreen = () => (
  <View style={styles.container}>
    <Image style={styles.logo} source={Logo} />
    <Text style={styles.title}>CloudChat</Text>
    <TextInput style={styles.input} placeholder="email" />
    <TextInput style={styles.input} placeholder="password" secureTextEntry />
    <Button title="Login" titleColor="white" />
  </View>
);

export default LoginScreen;
