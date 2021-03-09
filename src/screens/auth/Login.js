import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import { Form, Item, Input, Label, Icon } from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { userAuth, getLocation } from '../../redux/actions/Actions';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import url from '../../utils';
import qs from 'qs';

const Login = (props) => {
  const refRBSheet = useRef();
  const dispatch = useDispatch();
  // const state = useSelector((state) => state.auth);
  // const { user } = state;

  const [logged, setLogged] = useState(false);
  const [active, setActive] = useState(false);
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMsg] = useState({ msg: '', color: '' });

  const { email, password } = form;
  const { msg, color } = message;

  const buttons = [{ title: 'LOGIN', navigate: 'Drawer_navigation' }];

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    BackHandler.exitApp();

    return true;
  };

  const onChange = (str, val) => {
    switch (str) {
      case 'Email':
        setForm((prevState) => {
          return { ...prevState, email: val };
        });
        break;
      case 'Password':
        setForm((prevState) => {
          return { ...prevState, password: val };
        });
        break;
      case 'ForgotEmail':
        setForgotEmail(val);
        break;

      default:
        return form;
    }
  };

  setTimeout(() => {
    msg !== '' && (setLogged(false), setMsg({ msg: '', color: '' }));
  }, 3000);

  const login = async () => {
    console.log('DATA_POST', email, password);
    try {
      let res = await axios.post(
        url + '/login',
        qs.stringify({ username: email, password: password }),
        {
          headers: {
            // Authorization: 'Bearer ' + token, //the token is a variable which holds the token
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const data = res;
      console.log('response', data.data.result);

      data.data.result.message == 'Successfully logged in'
        ? (setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'done',
              color: FontColor.success,
            };
          }),
          setLogged(false),
          setTimeout(() => {
            props.navigation.navigate('Drawer_navigation');
          }, 1000),
          dispatch(
            userAuth(
              email,
              data.data.result.user_data,
              data.data.result.auth_token,
            ),
          ))
        : setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'fail',
              color: 'red',
            };
          });
      setLogged(false);
    } catch (error) {
      console.log('error', error);

      setMsg((prevState) => {
        return {
          ...prevState,
          msg: 'fail',
          color: 'red',
        };
      });
      setLogged(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={FontColor.green} />
      <Text style={styles.headingText}>SnapCheck</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarView}>
          <Image
            source={Pic.GifLogin}
            style={{ width: '100%', height: '100%' }}
            resizeMode="stretch"
          />
        </View>

        <Form>
          <Item
            underline
            style={[
              styles.item,
              { borderColor: active == false ? '#ccc' : FontColor.blue },
            ]}
            floatingLabel>
            <Label style={{ color: active == false ? '#ccc' : FontColor.blue }}>
              Email or Phone
            </Label>
            <Input
              style={{ paddingLeft: '3%' }}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              onChangeText={(text) => onChange('Email', text)}
            />
          </Item>

          <Item
            underline
            style={[
              styles.item,
              {
                borderColor: active1 == false ? '#ccc' : FontColor.blue,
                fontFamily: Fonts.Regular,
              },
            ]}
            floatingLabel>
            <Label
              style={{
                color: active1 == false ? '#ccc' : FontColor.blue,
                fontFamily: Fonts.Regular,
              }}>
              Password
            </Label>
            <Input
              secureTextEntry={true}
              style={{ paddingLeft: '3%' }}
              onChangeText={(text) => onChange('Password', text)}
              onFocus={() => setActive1(true)}
              onBlur={() => setActive1(false)}
            />
          </Item>
        </Form>

        <View style={styles.btnView}>
          <View style={[styles.btnRow, { justifyContent: 'flex-end' }]}>
            {buttons.map((v, i) => {
              return (
                <Animatable.View
                  animation="bounceIn"
                  duration={1000}
                  key={v.title}
                  style={styles.btn}>
                  {logged == true ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <TouchableOpacity
                      style={styles.viewTouch}
                      onPress={() => (
                        setLogged(true), login()
                        // props.navigation.navigate('Drawer_navigation')
                      )}>
                      <Text style={styles.loggedText}>{v.title}</Text>
                    </TouchableOpacity>
                  )}
                </Animatable.View>
              );
            })}
          </View>
        </View>
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <Text style={styles.forgetBtn}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.fiveStar}>Five Star Multiservices Pvt. Ltd.</Text>
        <Text style={styles.machotics}>
          Powered by{'\n'}Machotics Pvt. Ltd.
        </Text>
      </View>

      {msg != '' && (
        <Animatable.View
          animation="fadeInUpBig"
          duration={1000}
          style={[styles.btn1, { backgroundColor: color }]}>
          <Text style={styles.txtTouch1}>
            {msg == 'done'
              ? 'You are Logged in successfully.'
              : 'Oops! something went wrong.'}
          </Text>
        </Animatable.View>
      )}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={ScreenSize.hp3}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0, 0.2)',
          },
          draggableIcon: {
            backgroundColor: 'transparent',
          },
          container: {
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          },
        }}>
        <Form>
          <Item
            underline
            style={[
              styles.item,
              {
                borderColor:
                  active2 == false ? FontColor.green : FontColor.blue,
              },
            ]}
            floatingLabel>
            <Icon
              type="FontAwesome"
              active
              name="envelope"
              style={{
                color: active2 == false ? FontColor.green : FontColor.blue,
                paddingLeft: '1%',
                paddingBottom: '1.5%',
              }}
            />
            <Label
              style={{
                color: active2 == false ? FontColor.green : FontColor.blue,
                paddingLeft: '5%',
                fontFamily: Fonts.Regular,
              }}>
              Email
            </Label>

            <Input
              style={{ paddingLeft: '5%' }}
              onFocus={() => setActive2(true)}
              onBlur={() => setActive2(false)}
              onChangeText={(text) => onChange('ForgotEmail', text)}
            />
          </Item>
        </Form>
        <View style={styles.btnView}>
          <View style={styles.btnRow}>
            {['CANCEL', 'SUBMIT'].map((v, i) => {
              return (
                <TouchableOpacity
                  onPress={() => refRBSheet.current.close()}
                  key={v}
                  style={[
                    styles.btn,
                    {
                      elevation: i == 0 ? 0 : 2,
                      borderColor: i == 0 ? 'gray' : 'orange',
                      backgroundColor: i == 0 ? '#fff' : 'orange',
                      width: '45%',
                      borderRadius: i == 0 ? 0 : 5,
                      paddingTop: '2%',
                    },
                  ]}>
                  <Text
                    style={{
                      color: i == 0 ? FontColor.blue : 'white',
                      fontSize: FontSize.font25,
                      fontFamily: Fonts.SemiBold,
                    }}>
                    {v}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btnView: {
    height: ScreenSize.hp06,
    marginVertical: '4%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  btnRow: {
    height: '100%',
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    height: '90%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderColor: 'orange',
    backgroundColor: 'orange',
    width: '55%',
    borderRadius: 5,
  },
  item: {
    // backgroundColor: 'red',
    height: ScreenSize.hp1,
    marginVertical: '2%',
    width: '90%',
    alignSelf: 'center',
  },
  avatarView: {
    height: ScreenSize.hp4,
  },
  forgetBtn: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    fontFamily: Fonts.Bold,
    color: FontColor.green,
    textDecorationLine: 'underline',
    fontSize: FontSize.font2,
  },
  viewTouch: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn1: {
    height: ScreenSize.hp07,
    width: '85%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 5,
    position: 'absolute',
    bottom: '5%',
  },
  txtTouch1: {
    color: '#fff',
    fontSize: FontSize.font25,
    fontFamily: Fonts.Bold,
    // letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '1%',
    marginHorizontal: '3%',
    alignItems: 'flex-end',
    // backgroundColor: 'red',
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
  headingText: {
    fontSize: FontSize.font3,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '3%',
    backgroundColor: 'rgba(228, 233, 237, 0.5)',
    fontFamily: Fonts.SemiBold,
  },
  loggedText: {
    color: 'white',
    fontSize: FontSize.font2,
    fontFamily: Fonts.Bold,
    paddingTop: '2%',
  },
});

export default Login;
