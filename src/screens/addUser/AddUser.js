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
  ActivityIndicator,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../../redux/actions/Actions';
import ImagePicker from 'react-native-image-picker';
import { Avatar, Accessory } from 'react-native-elements';
import url from '../../utils';
import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import qs from 'qs';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

const AddUser = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { newUserPic } = state;
  const authState = useSelector((state) => state.auth);
  const { userData, token } = authState;

  const [pic, setPic] = useState('');
  const [form, setForm] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    shift: '',
    timings: '',
    cnic: '',
    wage: '',
  });
  const {
    name,
    designation,
    department,
    phone,
    shift,
    timings,
    wage,
    cnic,
  } = form;
  const [message, setMsg] = useState({ msg: '', color: '' });
  const { msg, color } = message;
  const [imageURL, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);

  const inputs = [
    { default: 'First Name     Last Name', val: name, icon: 'user-tie' },
    { default: 'CNIC Number', val: cnic, icon: 'id-card' },
    { default: 'Daily Wage', val: wage, icon: 'money-bill-alt' },
    { default: 'Designation', val: designation, icon: 'briefcase' },
    { default: 'Department', val: department, icon: 'hotel' },
    { default: 'Shift', val: shift, icon: 'user-clock' },
    { default: 'Shift Timings', val: timings, icon: 'clock' },
    { default: 'Phone', val: phone, icon: 'phone' },
  ];

  useEffect(() => {
    console.log('ADD', newUserPic);
  }, [form]);

  const options = {
    title: 'Select Profile Pic',
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
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response;

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const file = {
          uri: response.uri,
          name: response.fileName,
          type: 'image/jpeg',
        };
        uploadImageOnS3(file);

        setPic(source);
        dispatch(addUser(source));
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
        setLoading(false);
      }
    });
    // });
  };

  const onChange = (str, val) => {
    switch (str) {
      case 'First Name     Last Name':
        setForm((prevState) => {
          return { ...prevState, name: val };
        });
        break;
      case 'Designation':
        setForm((prevState) => {
          return { ...prevState, designation: val };
        });
        break;
      case 'Phone':
        setForm((prevState) => {
          return { ...prevState, phone: val };
        });
        break;
      case 'Department':
        setForm((prevState) => {
          return { ...prevState, department: val };
        });
        break;
      case 'Shift':
        setForm((prevState) => {
          return { ...prevState, shift: val };
        });
        break;
      case 'Shift Timings':
        setForm((prevState) => {
          return { ...prevState, timings: val };
        });
        break;
      case 'CNIC Number':
        setForm((prevState) => {
          return { ...prevState, cnic: val };
        });
        break;
      case 'Daily Wage':
        setForm((prevState) => {
          return { ...prevState, wage: val };
        });
        break;

      default:
        return form;
    }
    // console.log('FORM', form);
  };

  // const { name, designation, department, phone, shift, timings } = form;

  const login = async () => {
    const splittedUrl = imageURL.split('com/');
    console.log('DATA_FOR_POSTING', splittedUrl[1]);

    // console.log('DATA_POST', email, password, qs);
    try {
      let res = await axios.get(
        url +
          `/addReplacement?key=${splittedUrl[1]}&name=${name}&cnicNumber=${cnic}&dailyWage=${wage}&designation=${designation}&shift=${shift}&shiftTiming=${timings}&phone=${phone}`,
      );
      const data = res;
      console.log('response', data.data.result);

      data.data.result == 'Data inserted'
        ? (setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'done',
              color: FontColor.success,
            };
          }),
          setLoading(false))
        : setMsg((prevState) => {
            return {
              ...prevState,
              msg: 'fail',
              color: 'red',
            };
          });
      setLoading(false);
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
    }
  };

  setTimeout(() => {
    msg != ''
      ? (setPic(''),
        setMsg((prevState) => {
          return {
            ...prevState,
            msg: '',
            color: '',
          };
        }),
        setForm({
          name: '',
          designation: '',
          department: '',
          phone: '',
          shift: '',
          timings: '',
          cnic: '',
          wage: '',
        }),
        dispatch(addUser('')))
      : null;
  }, 3000);

  const buttons = [{ title: 'CANCEL' }, { title: 'SUBMIT' }];

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Add Replacement"
        back
        navigation={props.navigation}
        drawerIcon
        navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.heading}>Add User</Text> */}

        <View style={styles.avatarView}>
          <Avatar
            imageProps={{ resizeMode: 'cover' }}
            size="xlarge"
            source={
              newUserPic == '' || newUserPic == undefined
                ? Pic.User
                : newUserPic
            }
            rounded
            style={{ height: ScreenSize.hp15, width: ScreenSize.hp15 }}
            onPress={() => (getPic(), setLoading(true))}>
            <Accessory size={30} icon="home" style={styles.iconAccess} />
          </Avatar>
        </View>

        <View>
          {inputs.map((v, i) => {
            return (
              <View
                key={i}
                style={[styles.inpBord, { marginTop: i == 0 ? '0%' : '2%' }]}>
                <View style={styles.iconLock}>
                  <Icons.FontAwesome5 name={v.icon} color={'gray'} size={15} />
                </View>
                <TextInput
                  style={styles.inpTxt}
                  placeholder={v.default}
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => onChange(v.default, text)}
                  value={v.val}
                />
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
                  onPress={() =>
                    i == 0
                      ? props.navigation.goBack()
                      : (login(), setLoading(true))
                  }
                  style={[
                    styles.btn,
                    {
                      elevation: i == 0 ? 0 : 2,
                      borderColor: i == 0 ? FontColor.blue : 'orange',
                      backgroundColor: i == 0 ? '#fff' : 'orange',
                    },
                  ]}>
                  {isLoading == true && i == 1 ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={{
                        color: i == 0 ? FontColor.blue : 'white',
                        fontSize: FontSize.font2,
                        fontFamily: Fonts.Regular,
                        paddingTop: '2%',
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
      {msg != '' && (
        <Animatable.View
          animation="fadeInUpBig"
          duration={1000}
          style={[styles.btn1, { backgroundColor: color }]}>
          <Text style={styles.txtTouch1}>
            {msg == 'done'
              ? 'Replacement has been added.'
              : 'Oops! something went wrong, Try again.'}
          </Text>
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
    paddingVertical: '4%',
    // backgroundColor: 'rgba(228, 233, 237, 0.5)',
  },
  inpBord: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: ScreenSize.hp065,
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
    height: ScreenSize.hp05,
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
    height: ScreenSize.hp2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAccess: {
    height: 40,
    width: 40,
    borderRadius: 360,
    backgroundColor: 'orange',
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
  inpTxt: {
    flex: 5,
    height: '100%',
    fontSize: FontSize.font2,
    fontFamily: Fonts.Regular,
    marginTop: '2%',
  },
});

export default AddUser;
