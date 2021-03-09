import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { ScreenSize, Fonts, FontSize, FontColor } from '../../components/theme';
import * as Icons from '../../components/icons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import url from '../../utils';
import qs from 'qs';

const Password = (props) => {
  const authState = useSelector((state) => state.auth);
  const { userData, token } = authState;

  const [isLoading, setLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const [showPassword, setShowPassword] = useState([]);
  const [message, setMsg] = useState({ msg: '', color: '' });
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { oldPassword, newPassword, confirmPassword } = form;
  const { msg, color } = message;

  const inputs = [
    { default: 'Old Password', val: oldPassword, active: true },
    { default: 'New Password', val: newPassword, active: true },
    { default: 'Confirm Password', val: confirmPassword, active: true },
  ];

  useEffect(() => {
    // console.log('REFRESHED');
  }, [eye]);

  const toggleEye = (index) => {
    if (showPassword.includes(index)) {
      const filter = showPassword.filter((v) => v !== index);
      setShowPassword(filter);
    } else {
      showPassword.push(index);
      setShowPassword(showPassword);
    }
    setEye(!eye);
  };

  const onChange = (str, val) => {
    switch (str) {
      case 'Old Password':
        setForm((prevState) => {
          return { ...prevState, oldPassword: val };
        });
        break;
      case 'New Password':
        setForm((prevState) => {
          return { ...prevState, newPassword: val };
        });
        break;
      case 'Confirm Password':
        setForm((prevState) => {
          return { ...prevState, confirmPassword: val };
        });
        break;

      default:
        return form;
    }
    // console.log(form);
  };

  const buttons = [
    { title: 'CANCEL', pressed: () => props.navigation.goBack() },
    { title: 'SUBMIT', pressed: () => (setLoading(true), updatePassword()) },
  ];

  const updatePassword = () => {
    console.log('DATA_CHANGE_PASSWORD', userData, oldPassword, newPassword);
    oldPassword !== '' && newPassword !== '' && confirmPassword !== ''
      ? newPassword == confirmPassword
        ? axios
            .post(
              url + `/changePassword`,
              qs.stringify({
                oldPassword: oldPassword,
                password: newPassword,
                username: userData.email,
              }),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            )
            .then((data) => {
              console.log('API_RESPPONSE', data.data);
              data.data.result == 'Password has been successfully changed'
                ? setMsg((prevState) => {
                    return {
                      ...prevState,
                      msg: data.data.result,
                      color: FontColor.success,
                    };
                  })
                : setMsg((prevState) => {
                    return {
                      ...prevState,
                      msg: data.data.result,
                      color: 'red',
                    };
                  });
            })
            .catch(function (error) {
              console.log('API_ERROR', error);
              setMsg((prevState) => {
                return {
                  ...prevState,
                  msg: 'Network Error!',
                  color: 'red',
                };
              });
            })
            .finally(() => setLoading(false))
        : (setMsg((prevState) => {
            return {
              ...prevState,
              msg: "Passwords Doesn't Match!",
              color: 'red',
            };
          }),
          setLoading(false))
      : (setMsg((prevState) => {
          return {
            ...prevState,
            msg: 'All input fields must be filled!',
            color: 'red',
          };
        }),
        setLoading(false));
  };

  setTimeout(() => {
    msg != '' &&
      setMsg((prevState) => {
        return {
          ...prevState,
          msg: '',
          color: '',
        };
      });
  }, 3000);

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Change Password"
        back
        navigation={props.navigation}
        drawerIcon
        navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Change Your Password</Text>

        <View>
          {inputs.map((v, i) => {
            return (
              <View
                key={i}
                style={[styles.inpBord, { marginTop: i == 0 ? '2%' : '4%' }]}>
                <View style={styles.iconLock}>
                  <Icons.Entypo name="lock" color="gray" size={22} />
                </View>
                <TextInput
                  style={{
                    flex: 5,
                    height: '100%',
                    fontSize: FontSize.font25,
                    fontFamily: Fonts.Regular,
                  }}
                  placeholder={v.default}
                  onChangeText={(text) => onChange(v.default, text)}
                  value={v.val}
                  secureTextEntry={
                    showPassword.includes(i) == false ? false : true
                  }
                />
                <TouchableOpacity
                  onPress={() => toggleEye(i)}
                  style={styles.iconEye}>
                  <Icons.Entypo
                    name={
                      showPassword.includes(i) == false
                        ? 'eye'
                        : 'eye-with-line'
                    }
                    color="gray"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.btnView}>
          <View style={styles.btnRow}>
            {buttons.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={v.pressed}
                  style={[
                    styles.btn,
                    {
                      elevation: i == 0 ? 0 : 2,
                      borderColor: i == 0 ? FontColor.blue : 'orange',
                      backgroundColor: i == 0 ? '#fff' : 'orange',
                    },
                  ]}>
                  {i == 1 && isLoading == true ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={{
                        color: i == 0 ? FontColor.blue : 'white',
                        fontSize: FontSize.font2,
                        fontFamily: Fonts.Regular,
                      }}>
                      {v.title}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {message.msg != '' && (
        <Animatable.View
          animation="fadeInUpBig"
          duration={750}
          // delay={500}
          style={[styles.btn1, { backgroundColor: color }]}>
          <TouchableOpacity
            style={styles.touchMark}
            // onPress={() => (postImage(), setLoading(true))}
          >
            <Text style={styles.txtTouch1}>{msg}</Text>
          </TouchableOpacity>
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
  touch3: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(128,128,128,0.2)',
    height: 20,
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
  heading: {
    fontSize: FontSize.font4,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '2%',
    fontFamily: Fonts.Regular,
    // backgroundColor: 'rgba(228, 233, 237, 0.5)',
  },
  inpBord: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: ScreenSize.hp08,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: FontColor.green,
  },
  iconLock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconEye: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  btnView: {
    height: ScreenSize.hp06,
    marginTop: '2%',
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
    width: '45%',
    borderRadius: 5,
    borderWidth: 1.5,
    paddingTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn1: {
    height: ScreenSize.hp08,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 5,
    position: 'absolute',
    bottom: '8%',
    padding: '2%',
  },
  touchMark: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  txtTouch1: {
    color: '#fff',
    fontSize: FontSize.font25,
    fontFamily: Fonts.Bold,
    // letterSpacing: 2,
  },
});

export default Password;
