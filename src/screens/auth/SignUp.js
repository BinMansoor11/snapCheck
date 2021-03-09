import React, { useState, useEffect } from 'react';
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
import GlobalHeader from '../../components/GlobalHeader';
import { ScreenSize, Pic, FontSize, FontColor } from '../../components/theme';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../../redux/actions/Actions';
import axios from 'axios';
import { Avatar, Accessory } from 'react-native-elements';

const SignUp = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { newUserPic } = state;

  const [country, setCountry] = useState([]);
  const [countryPicker, setCountryPicker] = useState(false);
  const [eye, setEye] = useState(true);
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    countryName: '',
    phone: '',
    email: '',
    password: '',
  });
  const { name, companyName, countryName, phone, email, password } = form;

  const inputs = [
    { default: 'Full Name', val: name, icon: 'user-tie' },
    { default: 'Company Name', val: companyName, icon: 'keyboard' },
    { default: 'Country Name', val: countryName, icon: 'flag' },
    { default: 'Phone', val: phone, icon: 'phone' },
    { default: 'Email', val: email, icon: 'envelope' },
    { default: 'Password', val: password, icon: 'lock' },
  ];

  useEffect(() => {
    getCountry();
  }, []);

  const toggleEye = () => setEye(!eye);

  const getCountry = async () => {
    try {
      const res = await axios.get('https://restcountries.eu/rest/v2/all');
      //   console.log('Country_DATA', res.data);
      setCountry(res.data);
    } catch (error) {
      console.log('Country_DATA_ERROR', error);
    }
  };

  const onChange = (str, val) => {
    switch (str) {
      case 'Full Name':
        setForm((prevState) => {
          return { ...prevState, name: val };
        });
        break;
      case 'Company Name':
        setForm((prevState) => {
          return { ...prevState, companyName: val };
        });
        break;
      case 'Phone':
        setForm((prevState) => {
          return { ...prevState, phone: val };
        });
        break;
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
      case 'Country Name':
        setForm((prevState) => {
          return { ...prevState, countryName: val };
        });
        break;

      default:
        return form;
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader headingText="Heading" back navigation={props.navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <Text style={styles.heading}>Register Company</Text>
        <Text style={styles.warning}>
          Note: This form is only for company registration. If the company is
          already registered, employees should not fill this form. they should
          only login with admin's help.
        </Text>
        <View>
          {inputs.map((v, i) => {
            return (
              <View
                style={[styles.inpBord, { marginTop: i == 0 ? '0%' : '3%' }]}>
                <View style={styles.iconLock}>
                  <Icons.FontAwesome5
                    name={v.icon}
                    color="rgba(128,128,128, 0.6)"
                    size={18}
                  />
                </View>
                <TextInput
                  key={v.default}
                  onChangeText={(text) => onChange(v.default, text)}
                  editable={v.default == 'Country Name' ? false : true}
                  secureTextEntry={
                    i == inputs.length - 1
                      ? eye == false
                        ? false
                        : true
                      : false
                  }
                  style={{
                    flex: 5,
                    height: '100%',
                    fontSize: FontSize.font25,
                    color: '#000',
                  }}
                  placeholder={v.default}
                  placeholderTextColor={
                    v.default == 'Country Name' ? '#000' : 'gray'
                  }
                  value={v.val}
                />

                {i == inputs.length - 1 && (
                  <TouchableOpacity
                    style={styles.iconEye}
                    onPress={() => toggleEye()}>
                    <Icons.Entypo
                      name={eye == false ? 'eye' : 'eye-with-line'}
                      color="gray"
                      size={20}
                    />
                  </TouchableOpacity>
                )}
                {v.default == 'Country Name' && (
                  <TouchableOpacity
                    onPress={() => setCountryPicker(true)}
                    style={[styles.iconCaret]}>
                    <Icons.FontAwesome5
                      name="caret-down"
                      color="gray"
                      size={15}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('Drawer_navigation')}
          style={styles.btn2}>
          <Text style={{ color: 'white', fontSize: FontSize.font3 }}>
            Register Company
          </Text>
        </TouchableOpacity>

        {countryPicker == true && (
          <View style={styles.countryOverlay}>
            <ScrollView>
              {country.map((v, i) => {
                return (
                  <TouchableOpacity
                    key={v.name}
                    onPress={() => (
                      onChange('Country Name', v.name), setCountryPicker(false)
                    )}
                    style={styles.countryTouch}>
                    <Text style={{ fontSize: 15 }}>{v.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
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
    fontSize: FontSize.font3,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '2%',
    fontWeight: 'bold',
    // backgroundColor: 'rgba(228, 233, 237, 0.5)',
  },
  inpBord: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: ScreenSize.hp08,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#ccc',
    // marginTop: '3%',
  },
  iconLock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconEye: {
    // flex: 1,
    // backgroundColor: 'red',
    paddingRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  btnView: {
    height: ScreenSize.hp06,
    marginVertical: '2%',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarView: {
    height: ScreenSize.hp25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAccess: {
    height: 40,
    width: 40,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  iconCaret: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: '5%',
    justifyContent: 'center',
    height: '100%',
  },

  btn2: {
    elevation: 2,

    backgroundColor: 'orange',
    height: ScreenSize.hp09,
    width: '85%',
    marginVertical: '5%',
    alignSelf: 'center',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryOverlay: {
    height: ScreenSize.hp8,
    position: 'absolute',
    right: 0,
    zIndex: 9999,
    width: '75%',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 3,
  },
  countryTouch: {
    height: ScreenSize.hp07,
    justifyContent: 'center',
    paddingLeft: '5%',
  },
  warning: {
    width: '95%',
    alignSelf: 'center',
    color: 'red',
    textAlign: 'center',
    marginBottom: '2%',
  },
});

export default SignUp;
