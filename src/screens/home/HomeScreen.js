import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
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
import {
  savePic,
  getLocation,
  loading,
  loaded,
} from '../../redux/actions/Actions';
import ImagePicker from 'react-native-image-picker';
import { Avatar, Accessory } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);
import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import url from '../../utils';

const HomeScreen = (props) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { image, _loading, _loaded, _res, location } = state;
  const authState = useSelector((state) => state.auth);
  const { userData, token } = authState;

  const [pic, setPic] = useState('');
  const [add, setAdd] = useState(false);
  const [mark, setMark] = useState(false);
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState(false);
  const [active, setActive] = useState(null);
  const [disable, setDisable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMsg] = useState({ msg: '', color: '', res: '' });
  const [imageURL, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [loader, setLoader] = useState(false);

  const { msg, color, res } = message;

  useEffect(() => {
    updateLocation();

    console.log(isFocused);
    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isFocused]);

  const updateLocation = () => {
    dispatch(loading(true));
    dispatch(getLocation());
  };
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to Exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const options = {
    title: 'Select Profile Pic',
    maxWidth: 250,
    maxHeight: 250,
    // customButtons: [{ name: 'gallery', title: 'Choose Photo from gallery' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getPic = () => {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        setDisable(false);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('SOUUURCE', source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const file = {
          uri: response.uri,
          name: response.fileName,
          type: 'image/jpeg',
        };
        uploadImageOnS3(file);
        setLoader(true);
        // setUser();
        setPic(source);
        dispatch(savePic(source));
      }
    });
    console.log('AVATAR', pic);
  };

  const uploadImageOnS3 = async (file) => {
    const s3bucket = new S3({
      accessKeyId: 'AKIAI4ONGQXAKFMRSZ4A',
      secretAccessKey: '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',
      Bucket: 'fms-pics',
      signatureVersion: 'v4',
      ACL: 'public-read',
    });
    let contentType = 'image/jpeg';
    let contentDeposition = 'inline;filename="' + file.name + '"';
    const base64 = await fs.readFile(file.uri, 'base64');
    const arrayBuffer = decode(base64);
    // s3bucket.createBucket(() => {
    const params = {
      Bucket: 'fms-pics',
      Key: file.name,
      Body: arrayBuffer,
      ContentDisposition: contentDeposition,
      ContentType: contentType,
      ACL: 'public-read',
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log('error in callback');
      } else {
        console.log('success');
        console.log('Respomse URL : ' + data.Location);
        setImageUrl(data.Location);
        setMark(true);
        setLoader(false);
      }
    });
    // });
  };

  const setUser = () => {
    // setTimeout(() => {
    //   setUserName(true);
    // }, 2000);

    setTimeout(() => {
      setMark(true);
    }, 2000);
  };

  setTimeout(() => {
    status == true
      ? (setStatus(false),
        setMark(false),
        setDisable(false),
        setPic(''),
        dispatch(savePic('')),
        setUserName(''),
        setMsg((prevState) => {
          return {
            ...prevState,
            msg: '',
            color: '',
            res: '',
          };
        }))
      : null;
  }, 4000);

  const setAct = (i) => setActive(i);

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

  const postImage = async () => {
    try {
      // console.log('DATA_FOR_POSTING', imageURL);
      const splittedUrl = imageURL.split('com/');
      console.log('DATA_FOR_POSTING', splittedUrl[1]);

      // var locate;

      let res = await axios.get(
        url +
          `/matchUser?pic=${splittedUrl[1]}&lat=${location.latitude}&long=${location.longitude}`,
        {
          headers: {
            Authorization: 'Bearer ' + token, //the token is a variable which holds the token
          },
        },
      );
      const data = res;
      console.log('response', data.data);

      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      const t = h + ':' + m;

      data.data.data == 'true'
        ? (setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'done',
              color: FontColor.success,
              res: data.data.msg,
            };
          }),
          setLoading(false),
          setStatus(true),
          setUserName(data.data.name),
          setDate(t))
        : setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'fail',
              color: 'red',
              res: data.data.msg,
            };
          });
      setLoading(false);
      setStatus(true);
      setUserName(data.data.name);
      setDate(t);
    } catch (error) {
      console.log('error', error);

      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      const t = h + ':' + m;

      setMsg((prevState) => {
        return {
          ...prevState,
          msg: 'fail',
          color: 'red',
          res: 'Oops! Something went wrong.',
        };
      });
      setLoading(false);
      setStatus(true);
      setUserName('');
      setDate(t);
    }
  };

  setTimeout(() => {
    _loaded && dispatch(loaded(false, null));
  }, 4000);

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="SnapCheck ( FSM PVT. LTD. )"
        drawerIcon
        home
        navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView>
        {/* <Text style={styles.headingText}>Supervisor / HBL</Text> */}
        <Text style={styles.headingText}>Daily Attendance</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {/* <Animatable.View
            animation="bounceIn"
            duration={1000}
            style={styles.btnManual}>
            <TouchableOpacity
              style={styles.viewTouch}
              onPress={() => setAdd(true)}>
              <Text style={styles.txtTouchManual}>Add Manually</Text>
            </TouchableOpacity>
          </Animatable.View> */}

          <Animatable.View
            animation="bounceIn"
            duration={1000}
            style={styles.btnManual1}>
            <TouchableOpacity
              style={styles.viewTouch}
              onPress={() => updateLocation()}>
              {_loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icons.Entypo
                  name="location-pin"
                  color="#fff"
                  size={ScreenSize.hp03}
                />
              )}
            </TouchableOpacity>
          </Animatable.View>
        </View>

        <View style={styles.avatarView}>
          <Avatar
            imageProps={{ resizeMode: 'cover' }}
            size="xlarge"
            source={image == '' || image == undefined ? Pic.User : image}
            onPress={() => (setMark(false), getPic())}
            style={{ height: ScreenSize.hp2, width: ScreenSize.hp2 }}
            rounded>
            <Accessory size={30} icon="home" style={styles.iconAccess} />
          </Avatar>
        </View>

        {userName !== '' && (
          <Animatable.Text
            animation="bounceIn"
            duration={1000}
            delay={250}
            style={styles.username}>
            {userName}
          </Animatable.Text>
        )}

        {disable == false && (
          <Animatable.View
            animation="bounceIn"
            duration={1000}
            style={styles.btn}>
            <TouchableOpacity
              style={styles.viewTouch}
              onPress={() => (setMark(false), getPic())}>
              <Text style={styles.txtTouch}>TIME IN</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
        <View style={{ width: '70%', alignSelf: 'center', marginTop: '5%' }}>
          {drawerItems.map((v, i) => {
            return (
              <View key={i} style={styles.touch3}>
                <View style={styles.titleView}>
                  <View
                    style={{
                      flex: 4,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.titleText}>{v.title}</Text>
                    <Text style={styles.titleText1}>{v.subtitle}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.addressView}>
          <Text style={styles.addressText}>
            Mezzanine Office Building No. C-73-C Rehan Arcade, 24 Com. Street,
            Phase 2 ext. D.H.A., Karachi, 75500
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.fiveStar}>Five Star Multiservices Pvt. Ltd.</Text>
        <Text style={styles.machotics}>
          Powered by{'\n'}Machotics Pvt. Ltd.
        </Text>
      </View>

      {add == true && (
        <View style={styles.countryOverlay}>
          <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 0.5 }}>
            <TouchableOpacity
              disabled={active == null ? true : false}
              onPress={() => (
                setUser(),
                setAdd(false),
                setActive(null),
                setDisable(true),
                setPic({ uri: 'https://picsum.photos/seed/picsum/200/300' }),
                dispatch(
                  savePic({ uri: 'https://picsum.photos/seed/picsum/200/300' }),
                )
              )}
              style={[
                styles.btnAdd,
                {
                  backgroundColor: active == null ? '#b5b5b5' : FontColor.green,
                },
              ]}>
              <Text style={styles.txtAdd}>Select</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 1, 1, 1, 1, 1, 1].map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setAct(i)}
                  style={[
                    styles.countryTouch,
                    {
                      backgroundColor:
                        i == active ? FontColor.green : 'transparent',
                    },
                  ]}>
                  <Thumbnail
                    small
                    // source={Pic.User}
                    source={{
                      uri: 'https://picsum.photos/seed/picsum/200/300',
                    }}
                  />
                  <Text
                    style={[
                      styles.addManualUser,
                      { color: i == active ? '#fff' : '#000' },
                    ]}>
                    User
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {mark == true && (
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          style={styles.btn1}>
          <TouchableOpacity
            style={styles.touchMark}
            onPress={() => (postImage(), setLoading(true))}>
            <Icons.FontAwesome5 name="user-clock" color="#fff" size={20} />
            {isLoading == true ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.txtTouch1}>Mark Attendance</Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* <ActivityIndicator size="small" color="#fff" /> */}

      {_loaded && (
        <Animatable.View
          animation="fadeInUpBig"
          duration={1000}
          style={[
            styles.btn1,
            { backgroundColor: _res ? FontColor.success : 'red', width: '90%' },
          ]}>
          <Text style={styles.txtTouch1}>
            {_res ? 'Location is Updated!' : 'Unable to update Location!'}
            {/* {msg == 'done'
              ? 'You are Logged in successfully.'
              : 'Oops! something went wrong.'} */}
          </Text>
        </Animatable.View>
      )}

      {status == true && (
        <Animatable.View
          duration={500}
          delay={500}
          animation="fadeInUpBig"
          style={[
            styles.avatarView1,
            {
              backgroundColor: color,
            },
          ]}>
          <View style={{ marginLeft: '-10%' }}>
            <Avatar
              imageProps={{ resizeMode: 'cover' }}
              size="large"
              source={image == '' || image == undefined ? Pic.User : image}
              rounded
              // onPress={() => getPic()}
            ></Avatar>
          </View>
          <View style={styles.attendView}>
            <Text style={styles.attendHead}>
              {msg == 'done' ? 'Attendance Marked' : 'Not Marked'}
            </Text>
            {msg == 'done' && (
              <Text style={styles.attendTime}>Time: {date}</Text>
            )}

            <Text style={styles.attendName}>
              {msg == 'done' ? `Name: ${userName}` : res}
            </Text>
          </View>
        </Animatable.View>
      )}

      {loader == true && (
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  avatarView: {
    height: ScreenSize.hp22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarView1: {
    height: ScreenSize.hp2,
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: '5%',
    right: '2%',
    borderRadius: 10,
    elevation: 6,
  },
  iconAccess: {
    height: 40,
    width: 40,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  btn: {
    height: ScreenSize.hp06,
    width: '35%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
    backgroundColor: 'orange',
    marginTop: '3%',
  },
  btn1: {
    height: ScreenSize.hp07,
    width: '50%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 5,
    backgroundColor: 'orange',
    position: 'absolute',
    bottom: '8%',
  },
  btnManual: {
    height: ScreenSize.hp05,
    width: '25%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
    elevation: 5,
    backgroundColor: FontColor.green,
    marginTop: '2%',
    marginHorizontal: '2%',
  },
  btnManual1: {
    height: ScreenSize.hp04,
    width: ScreenSize.hp04,
    borderRadius: ScreenSize.hp04,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
    elevation: 5,
    backgroundColor: FontColor.green,
    marginTop: '2%',
    marginHorizontal: '4%',
  },
  txtTouch: {
    color: '#fff',
    fontSize: FontSize.font4,
    fontFamily: Fonts.Bold,
    letterSpacing: 2,
    paddingTop: '2%',
  },
  txtAdd: {
    color: '#fff',
    fontSize: FontSize.font25,
    fontFamily: Fonts.SemiBold,
    // letterSpacing: 2,
  },
  txtTouch1: {
    color: '#fff',
    fontSize: FontSize.font25,
    fontFamily: Fonts.Bold,
    // letterSpacing: 2,
  },
  txtTouchManual: {
    color: '#fff',
    fontSize: FontSize.font2,
    fontFamily: Fonts.Bold,
    // letterSpacing:,
  },
  countryOverlay: {
    height: ScreenSize.hp6,
    position: 'absolute',
    top: '10%',
    left: 0,
    zIndex: 9999,
    width: '60%',
    backgroundColor: '#fff',
    elevation: 10,
    borderRadius: 3,
  },
  countryTouch: {
    flexDirection: 'row',
    height: ScreenSize.hp07,
    width: '98%',
    alignSelf: 'center',
    borderRadius: 4,
    alignItems: 'center',
    paddingLeft: '10%',
  },
  attendView: {
    height: '100%',
    paddingLeft: '5%',
    width: '70%',
    paddingVertical: '5%',
  },
  attendHead: {
    fontFamily: Fonts.Bold,
    color: '#fff',
    fontSize: FontSize.font3,
    marginBottom: '1%',
  },
  attendTime: {
    fontFamily: Fonts.SemiBold,
    color: '#fff',
    fontSize: FontSize.font25,
  },
  attendName: {
    fontFamily: Fonts.SemiBold,
    color: '#fff',
    fontSize: FontSize.font25,
  },
  username: {
    textAlign: 'center',
    fontSize: FontSize.font4,
    color: FontColor.green,
    fontFamily: Fonts.Regular,
  },
  btnAdd: {
    height: ScreenSize.hp06,
    width: '90%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,

    marginVertical: '4%',
  },
  viewTouch: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchMark: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  addManualUser: {
    fontSize: FontSize.font25,
    paddingLeft: '5%',
    fontFamily: Fonts.Regular,
  },
  headingText: {
    fontSize: FontSize.font3,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '1%',
    backgroundColor: 'rgba(228, 233, 237, 0.5)',
    fontFamily: Fonts.SemiBold,
  },
  touch3: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    height: ScreenSize.hp03,
    justifyContent: 'space-between',
    // paddingLeft: '5%',
    alignItems: 'center',
    letterSpacing: 1.84,
    // marginBottom: '0.5%',
  },
  titleText: {
    fontSize: FontSize.font2,
    color: '#000',
    fontFamily: Fonts.Regular,
  },
  titleText1: {
    fontSize: FontSize.font2,
    fontFamily: Fonts.Bold,
    color: '#000',
  },
  titleView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '1%',
    marginHorizontal: '3%',
    alignItems: 'flex-end',
  },
  fiveStar: {
    color: FontColor.green,
    fontSize: FontSize.font17,
    fontFamily: Fonts.SemiBold,
  },
  machotics: {
    color: FontColor.green,
    fontSize: FontSize.font17,
    fontFamily: Fonts.SemiBold,
  },
  loaderView: {
    position: 'absolute',
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressView: {
    marginTop: '2%',
    padding: '4%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: FontColor.green,
    width: '85%',
    alignSelf: 'center',
  },
  addressText: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    fontSize: FontSize.font2,
  },
});

export default HomeScreen;
