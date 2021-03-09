import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ScreenSize, Pic, FontColor, Fonts } from '../../components/theme';
import * as Icons from '../../components/icons';

import BottomTab from '../../BottomTab';
import { useSelector, useDispatch } from 'react-redux';
// import { selectedCode } from '../redux/actions/Actions';

import { AddUser, Admin, RegisterUser } from '../../screens';
import { Avatar, Accessory } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { userAuth } from '../../redux/actions/Actions';

// import {NavigationContainer} from '@react-navigation/native';

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const authState = useSelector((state) => state.auth);
  const { userData } = authState;
  const { profilePic } = state;

  useEffect(() => {
    console.log('NAVIGATION_IN_CUSTOM_DRAWER', props);
  }, []);
  const drawerItems = [
    {
      title: 'Add Replacement',
      icon: 'adduser',
      pressed: () => props.navigation.navigate('AddUser'),
    },
    {
      title: 'Register User',
      icon: 'addusergroup',
      pressed: () => props.navigation.navigate('RegisterUser'),
    },
    {
      title: 'Logout',
      icon: 'logout',
      pressed: () => (
        props.navigation.navigate('Login'), dispatch(userAuth('', [], ''))
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View
        // onPress={() => alert('Some Function will be allotted!')}
        style={styles.mainView}>
        {userData.designation !== 'Admin' && (
          <Avatar
            imageProps={{ resizeMode: 'cover' }}
            size="large"
            source={
              profilePic == '' || profilePic == undefined
                ? Pic.User
                : profilePic
            }
            rounded
            onPress={() => props.navigation.navigate('Profile')}>
            <Accessory size={20} style={styles.avatarAccessary} />
          </Avatar>
        )}

        <Text style={styles.greetings}>
          {userData.full_name != undefined &&
            userData.full_name.charAt(0).toUpperCase() +
              userData.full_name.slice(1)}
        </Text>
        <Text
          style={{ fontSize: 13, color: '#fff', fontFamily: Fonts.Regular }}>
          {userData.designation}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {userData.designation == 'Admin' ||
        userData.designation == 'Supervisor' ? (
          <View>
            {drawerItems.map((v, i) => {
              return (
                <TouchableOpacity
                  key={v.title}
                  onPress={v.pressed}
                  style={styles.touch3}>
                  <View style={styles.btn}>
                    <View>
                      <Icons.AntDesign
                        name={v.icon}
                        size={30}
                        color={FontColor.green}
                      />
                    </View>
                    <View>
                      <Text style={styles.btnTitle}>{v.title}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => (
              props.navigation.navigate('Login'), dispatch(userAuth('', [], ''))
            )}
            style={styles.touch3}>
            <View style={styles.btn}>
              <View>
                <Icons.AntDesign
                  name="logout"
                  size={30}
                  color={FontColor.green}
                />
              </View>
              <View>
                <Text style={styles.btnTitle}>Logout</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const SettingsStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <SettingsStack.Navigator headerMode="none" initialRouteName="BottomTab">
      <SettingsStack.Screen name="BottomTab" component={BottomTab} />
      <SettingsStack.Screen name="AddUser" component={AddUser} />
      <SettingsStack.Screen name="RegisterUser" component={RegisterUser} />
    </SettingsStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function App(props) {
  const authState = useSelector((state) => state.auth);
  const { userData } = authState;

  const { navigation } = props;

  console.log('NAVIGATION IN DRAWER', props);
  return (
    <>
      <Drawer.Navigator
        drawerPosition="right"
        initialRouteName={
          userData.designation !== 'Admin' ? 'Home_Screen' : 'Admin'
        }
        // initialRouteName={'HomeStackScreen'}
        drawerStyle={{
          width: '75%',
        }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} navigation={navigation} />
        )}>
        <Drawer.Screen name="HomeStackScreen" component={HomeStackScreen} />
        <Drawer.Screen name="Admin" component={Admin} />
      </Drawer.Navigator>
    </>
  );
}

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
    height: ScreenSize.hp09,
    // backgroundColor: 'green',
    justifyContent: 'space-between',
    paddingLeft: '10%',
    alignItems: 'center',
    letterSpacing: 1.84,
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
  mainView: {
    height: ScreenSize.hp3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FontColor.green,
  },
  avatarAccessary: {
    height: 30,
    width: 30,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  greetings: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: '#fff',
    // fontFamily: Fonts.Regular,
  },
  btn: {
    flexDirection: 'row',
    flex: 3,
    alignItems: 'center',
  },
  btnTitle: {
    marginLeft: 15,
    fontSize: 16,
    color: FontColor.green,
    fontFamily: Fonts.SemiBold,
  },
});
