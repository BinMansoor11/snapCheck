import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import { Avatar, Accessory } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { saveProfilePic } from '../../redux/actions/Actions';

const Attendance = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { profilePic } = state;
  const authState = useSelector((state) => state.auth);
  const { userData } = authState;

  const [avatarSource, setAvatarSource] = useState(profilePic);

  const drawerItems = [
    {
      title: 'Name : ',
      subtitle:
        userData.full_name != undefined &&
        userData.full_name.charAt(0).toUpperCase() +
          userData.full_name.slice(1),
      icon: 'user-tie',
    },
    {
      title: 'Designation : ',
      subtitle: userData.designation,
      icon: 'briefcase',
    },
    { title: 'Phone : ', subtitle: userData.phone, icon: 'phone' },
  ];

  const options = {
    title: 'Select Profile Pic',
    // customButtons: [{ name: 'gallery', title: 'Choose Photo from gallery' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getProfilePic = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setAvatarSource(source);
        dispatch(saveProfilePic(source));
      }
    });
    console.log('AVATAR', avatarSource);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={FontColor.green} />

      <GlobalHeader
        headingText={userData.designation}
        back
        navigation={props.navigation}
        drawerIcon
        navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarView}>
          <Avatar
            imageProps={{ resizeMode: 'cover' }}
            size="xlarge"
            source={
              profilePic == '' || profilePic == undefined
                ? Pic.User
                : profilePic
            }
            rounded
            onPress={() => getProfilePic()}>
            <Accessory size={30} icon="home" style={styles.iconAccess} />
          </Avatar>
        </View>

        <View>
          {drawerItems.map((v, i) => {
            return (
              <View key={i} style={styles.touch3}>
                <View style={styles.titleView}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Icons.FontAwesome5 name={v.icon} size={20} color="gray" />
                  </View>
                  <View style={{ flex: 4, flexDirection: 'row' }}>
                    <Text style={styles.titleText}>{v.title}</Text>
                    <Text style={styles.titleText1}>{v.subtitle}</Text>
                  </View>
                </View>
              </View>
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
    height: ScreenSize.hp05,
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
  avatarView: {
    height: ScreenSize.hp3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAccess: {
    height: 40,
    width: 40,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  titleText: {
    fontSize: FontSize.font25,
    color: '#000',
    fontFamily: Fonts.Regular,
  },
  titleText1: {
    fontSize: FontSize.font25,
    fontFamily: Fonts.Bold,
    color: '#000',
  },
  titleView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});

export default Attendance;
