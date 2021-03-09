import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, StatusBar } from 'react-native';
import { Pic } from '../components/theme';
// import { useSelector, useDispatch } from 'react-redux';
import { Home } from '../screens';
import BottomTab from '../BottomTab';

const Splash = (props) => {
  // const state = useSelector((state) => state.root);
  // const { verifiedCode } = state;

  return (
    <View style={styles.view}>
      <StatusBar hidden />
      <Image
        source={Pic.Splash}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 30,
  },
});

export default Splash;
