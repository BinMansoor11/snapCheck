import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import GlobalHeader from '../../components/GlobalHeader';
import {
  Pic,
  ScreenSize,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import { savePic } from '../../redux/actions/Actions';
import ImagePicker from 'react-native-image-picker';
import { Avatar, Accessory } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);

const GetStarted = (props) => {
  const authState = useSelector((state) => state.auth);
  const { user } = authState;

  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate(user == '' ? 'Login' : 'Drawer_navigation');
    }, 0);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FontColor.green} />
      <ImageBackground
        source={Pic.Splash}
        style={{ width: '100%', height: '100%' }}
        resizeMode="stretch"></ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  avatarView: {
    height: ScreenSize.hp6,
  },
  iconAccess: {
    height: 40,
    width: 40,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  btnView: {
    height: ScreenSize.hp2,
    width: '90%',
    alignSelf: 'center',

    alignItems: 'center',
    backgroundColor: 'green',
  },
  btnRow: {
    height: '40%',
    width: '100%',
    backgroundColor: 'red',
    marginTop: '2%',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  btn: {
    height: ScreenSize.hp06,
    width: '50%',
    marginVertical: '1.5%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    elevation: 3,
    backgroundColor: FontColor.green,
    position: 'absolute',
    bottom: '6%',
  },
  heading: {
    fontSize: FontSize.font3,
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    color: FontColor.green,
    paddingVertical: '4%',
    backgroundColor: '#fff',
  },
  txt: {
    color: 'white',
    fontSize: FontSize.font3,
    fontFamily: Fonts.Bold,
  },
  viewTouch: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GetStarted;
