import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { ScreenSize, FontSize, FontColor, Fonts } from '../../components/theme';
import * as Icons from '../../components/icons';

const Settings = (props) => {
  const { navigation } = props;

  useEffect(() => {
    console.log('PROPS_IN_SETTING', props);
  }, []);

  const drawerItems = [
    {
      title: 'Profile',
      subtitle: 'Manage your profile',
      icon: 'user',
      navigate: 'Profile',
      data: props,
    },
    {
      title: 'Password',
      subtitle: 'Change your password',
      icon: 'lock',
      navigate: 'ChangePassword',
      data: props,
    },
  ];
  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Settings"
        back
        drawerIcon
        navigation={navigation}
        navigationDrawer={() => navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>Settings</Text>
        <View>
          {drawerItems.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  navigation.navigate(v.navigate, { data: v.data })
                }
                style={styles.touch3}>
                <View style={styles.optMain}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Icons.AntDesign
                      name={v.icon}
                      size={30}
                      color={FontColor.green}
                    />
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={styles.titleOpt}>{v.title}</Text>
                    <Text style={styles.subTitleOpt}>{v.subtitle}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Icons.AntDesign
                      name={'right'}
                      size={20}
                      color={FontColor.green}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  touch3: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(128,128,128,0.2)',
    height: ScreenSize.hp12,
    // backgroundColor: 'green',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    alignItems: 'center',
    letterSpacing: 1.84,
    marginBottom: 1,
  },
  badge: {
    backgroundColor: '#2e64b5',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    marginLeft: 5,
    marginTop: 5,
  },
  headingText: {
    fontSize: FontSize.font4,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '1%',
    backgroundColor: 'rgba(228, 233, 237, 0.5)',
    fontFamily: Fonts.SemiBold,
  },
  optMain: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  titleOpt: {
    fontSize: FontSize.font3,
    fontFamily: Fonts.Bold,
    color: FontColor.green,
    letterSpacing: 0.5,
  },
  subTitleOpt: {
    fontSize: FontSize.font17,
    color: FontColor.green,
    fontFamily: Fonts.Regular,
  },
});

export default Settings;
