import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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
import { saveRegisterationPic } from '../../redux/actions/Actions';
import ImagePicker from 'react-native-image-picker';
import { Avatar, Accessory, SearchBar } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import url from '../../utils';

const Register = (props) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { image } = state;
  const authState = useSelector((state) => state.auth);
  const { token, registerationPic } = authState;

  const [pic, setPic] = useState('');
  const [add, setAdd] = useState(false);
  const [mark, setMark] = useState(false);
  const [userName, setUserName] = useState(false);
  const [status, setStatus] = useState(false);
  const [active, setActive] = useState(null);
  const [disable, setDisable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMsg] = useState({ msg: '', color: '' });
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [imageURL, setImageUrl] = useState('');
  const [search, setSearch] = useState('');

  const { msg, color } = message;

  useEffect(() => {
    console.log('RegisterUser');
    getEmployees();

    return () => (setPic(''), dispatch(saveRegisterationPic('')));
  }, [isFocused]);

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
        // const source = { uri: response.uri };
        console.log('SOUUURCE', source);
        // You can also display the image using data:
        const source = response;
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const file = {
          uri: response.uri,
          name: response.fileName,
          type: 'image/jpeg',
        };
        uploadImageOnS3(file);

        setPic(source);
        dispatch(saveRegisterationPic(source));
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
        console.log('Respomse URL : ' + data.Location);
        setImageUrl(data.Location);
        setMark(true);
      }
    });
    // });
  };

  const setUser = () => {
    setTimeout(() => {
      setMark(true);
    }, 2000);
  };

  setTimeout(() => {
    status == true
      ? (setStatus(false),
        setActive(null),
        setMark(false),
        setDisable(false),
        setPic(''),
        setId(''),
        dispatch(saveRegisterationPic('')),
        setUserName(false),
        console.log('DFS', id),
        setMsg((prevState) => {
          return {
            ...prevState,
            msg: '',
            color: '',
          };
        }))
      : null;
  }, 5000);

  const setAct = (i) => setActive(i);

  const getEmployees = () => {
    axios
      .get(url + '/users', {
        headers: {
          Authorization: 'Bearer ' + token, //the token is a variable which holds the token
        },
      })
      .then(function (response) {
        console.log('API_RESPPONSE', response.data.result);
        setUsers(response.data.result);
      })
      .catch(function (error) {
        console.log('API_ERROR', error);
      })
      .finally(() => console.log(users));
  };

  const postImage = async () => {
    try {
      const splittedUrl = imageURL.split('com/');
      console.log('DATA_FOR_POSTING', splittedUrl[1], id);

      let res = await axios.get(
        url + `/updateEncoding?emp_id=${id}&pic=${splittedUrl[1]}`,
        {
          headers: {
            Authorization: 'Bearer ' + token, //the token is a variable which holds the token
          },
        },
      );
      const data = res;
      console.log('response', data.data);

      data.data.message == 'True'
        ? (setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'done',
              color: FontColor.success,
            };
          }),
          setLoading(false),
          setStatus(true))
        : setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'fail',
              color: 'red',
            };
          });
      setLoading(false);
      setStatus(true);
    } catch (error) {
      console.log('error', error);
      setMsg((prevState) => {
        return {
          ...prevState,
          msg: 'fail',
          color: 'red',
        };
      });
      setLoading(false);
      setStatus(true);
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Register User"
        drawerIcon
        back
        navigation={props.navigation}
        navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView>
        <View style={styles.avatarView}>
          <Avatar
            imageProps={{ resizeMode: 'cover' }}
            size="xlarge"
            source={
              registerationPic == '' || registerationPic == undefined
                ? Pic.User
                : registerationPic
            }
            onPress={() => (setMark(false), getPic())}
            style={{ height: ScreenSize.hp22, width: ScreenSize.hp22 }}
            rounded>
            <Accessory size={30} icon="home" style={styles.iconAccess} />
          </Avatar>
        </View>

        {userName == true && (
          <Animatable.Text
            animation="bounceIn"
            duration={1000}
            delay={250}
            style={styles.username}>
            {name}
          </Animatable.Text>
        )}

        {disable == true && (
          <Animatable.View
            animation="bounceIn"
            duration={1000}
            style={styles.btn}>
            <TouchableOpacity
              style={styles.viewTouch}
              onPress={() => (getPic(), setMark(false))}>
              <Text style={styles.txtTouch}>Camera</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        <View
          style={{
            backgroundColor: 'rgba(228, 233, 237, 0.5)',
            marginTop: '5%',
            height: ScreenSize.hp07,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: '2%',
          }}>
          <Text style={styles.headingText}>Employees</Text>
          <SearchBar
            placeholder="Search"
            placeholderTextColor="#fff"
            lightTheme
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ color: '#fff' }}
            showCancel
            searchIcon={{ color: '#fff', size: 20 }}
            onChangeText={(text) => setSearch(text)}
            value={search}
            // keyboardType="numeric"
            // onCancel
          />
        </View>

        {users.length > 0 ? (
          <View>
            {users.map((v, i) => {
              return (
                <View key={i}>
                  {v[2] && v[2].includes(search) == true ? (
                    <TouchableOpacity
                      key={i}
                      onPress={() => (
                        setUserName(true),
                        setAct(i),
                        setName(v[2]),
                        setMark(false),
                        setId(v[0]),
                        setAdd(false),
                        setDisable(true),
                        setPic({
                          uri: 'https://picsum.photos/seed/picsum/200/300',
                        }),
                        dispatch(
                          saveRegisterationPic({
                            uri: 'https://picsum.photos/seed/picsum/200/300',
                          }),
                        )
                      )}
                      style={[
                        styles.countryTouch,
                        {
                          backgroundColor:
                            i == active ? FontColor.green : 'transparent',
                        },
                      ]}>
                      <Thumbnail
                        source={{
                          uri: 'https://picsum.photos/seed/picsum/200/300',
                        }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.addManualUser,
                            {
                              color: i == active ? '#fff' : '#000',
                            },
                          ]}>
                          {v[2]}
                        </Text>
                        <View style={styles.viewDetails}>
                          <Text style={styles.txtDetails}>CNIC: {v[1]}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    v[1] &&
                    v[1].includes(search) == true && (
                      <TouchableOpacity
                        key={i}
                        onPress={() => (
                          setUserName(true),
                          setAct(i),
                          setName(v[2]),
                          setMark(false),
                          setId(v[0]),
                          setAdd(false),
                          setDisable(true),
                          setPic({
                            uri: 'https://picsum.photos/seed/picsum/200/300',
                          }),
                          dispatch(
                            saveRegisterationPic({
                              uri: 'https://picsum.photos/seed/picsum/200/300',
                            }),
                          )
                        )}
                        style={[
                          styles.countryTouch,
                          {
                            backgroundColor:
                              i == active ? FontColor.green : 'transparent',
                          },
                        ]}>
                        <Thumbnail
                          source={{
                            uri: 'https://picsum.photos/seed/picsum/200/300',
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.addManualUser,
                              {
                                color: i == active ? '#fff' : '#000',
                              },
                            ]}>
                            {v[2]}
                          </Text>
                          <View style={styles.viewDetails}>
                            <Text style={styles.txtDetails}>CNIC: {v[1]}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <ActivityIndicator
            size="large"
            color={FontColor.green}
            style={{ alignSelf: 'center', marginTop: '2%' }}
          />
        )}
      </ScrollView>

      {mark == true && (
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          style={styles.btn1}>
          <TouchableOpacity
            style={styles.touchMark}
            onPress={() => (postImage(), setLoading(true))}>
            <Icons.Entypo name="add-user" color="#fff" size={20} />
            {isLoading == true ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.txtTouch1}>Register User</Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* <ActivityIndicator size="small" color="#fff" /> */}
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
              source={
                registerationPic == '' || registerationPic == undefined
                  ? Pic.User
                  : registerationPic
              }
              rounded
              // onPress={() => getPic()}
            ></Avatar>
          </View>
          <View style={styles.attendView}>
            <Text style={styles.attendHead}>
              {msg == 'done' ? 'User Registered' : 'Not Registered'}
            </Text>
            {/* <Text style={styles.attendTime}>
              {msg == 'done' ? 'Time: 09:00' : 'Time: 00:00'}
            </Text> */}
            <Text style={styles.attendName}>
              {msg == 'done' ? 'Name: ' + name : 'Oops! Something went wrong.'}
            </Text>
          </View>
        </Animatable.View>
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
    height: ScreenSize.hp3,
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
    width: '40%',
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
    width: '45%',
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
    height: ScreenSize.hp1,
    width: '98%',
    alignSelf: 'center',
    borderRadius: 4,
    alignItems: 'center',
    paddingLeft: '2%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginBottom: '1%',
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
    fontSize: FontSize.font3,
  },
  attendName: {
    fontFamily: Fonts.SemiBold,
    color: '#fff',
    fontSize: FontSize.font3,
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
    fontSize: FontSize.font3,
    paddingLeft: '5%',
    fontFamily: Fonts.Regular,
  },
  headingText: {
    fontSize: FontSize.font3,
    color: FontColor.green,
    fontFamily: Fonts.SemiBold,
    flex: 1,
  },
  touch3: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    height: ScreenSize.hp04,
    justifyContent: 'space-between',
    // paddingLeft: '5%',
    alignItems: 'center',
    letterSpacing: 1.84,
    marginBottom: 1,
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
  searchContainer: {
    flex: 2,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: FontColor.green,
    height: ScreenSize.hp05,
  },

  txtDetails: {
    fontSize: FontSize.font2,
    fontFamily: Fonts.Regular,
    flex: 1,
  },
  viewDetails: {
    flexDirection: 'row',
    paddingLeft: '5%',
  },
});

export default Register;
