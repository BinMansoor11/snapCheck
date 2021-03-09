import React, { useEffect, useState } from 'react';
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
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import PieChart from './PieChart';
import { Tab, Tabs, DatePicker } from 'native-base';
import { Avatar, Accessory } from 'react-native-elements';

const Settings = (props) => {
  const { navigation } = props;

  const [chosenDate, setChosenDate] = useState('');
  const [close, setClose] = useState(false);

  useEffect(() => {}, []);

  const options = [
    { title: 'Present', color: '#C8E6C9' },
    { title: 'Absent', color: '#ffcdd2' },
    { title: 'Late Comers', color: '#2196f3' },
    { title: 'Early Leavers', color: '#03bbd6' },
  ];

  const setDate = (newDate) => {
    setChosenDate(newDate);
    // setClose(!close);
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const TabScreen = () => {
    return (
      <View>
        <ScrollView>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#ccc',
            }}>
            <View style={styles.nameRow}>
              {['Name', 'Time in', 'Time out'].map((v, i) => {
                return (
                  <Text
                    style={[
                      styles.txt,
                      {
                        textAlign: i == 0 ? 'left' : 'center',
                        flex: i == 0 ? 4 : 2,
                      },
                    ]}>
                    {v}
                  </Text>
                );
              })}
            </View>
          </View>

          {[1, 3, 3, 3, 3, 3, 3, 3].map((v, i) => {
            return (
              <View style={styles.userView}>
                <View style={{ flex: 4 }}>
                  <Text style={styles.userName}>User Name</Text>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontFamily: Fonts.Regular }}>
                      Time In : Location
                    </Text>

                    <Text style={{ fontFamily: Fonts.Regular, color: 'gray' }}>
                      Time Out: Location
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 2 }}>
                  <View style={styles.avatarView}>
                    <Text style={{ fontFamily: Fonts.Bold, letterSpacing: 1 }}>
                      09:00
                    </Text>
                    <Avatar
                      imageProps={{ resizeMode: 'cover' }}
                      size="large"
                      source={Pic.User}
                      rounded
                      // onPress={() => getPic()}
                      style={{
                        height: ScreenSize.hp1,
                        width: ScreenSize.hp1,
                      }}></Avatar>
                  </View>
                </View>

                <View style={{ flex: 2 }}>
                  <View style={styles.avatarView}>
                    <Text style={{ fontFamily: Fonts.Bold, letterSpacing: 1 }}>
                      05:00
                    </Text>
                    <Avatar
                      imageProps={{ resizeMode: 'cover' }}
                      size="large"
                      source={Pic.User}
                      rounded
                      style={{
                        height: ScreenSize.hp1,
                        width: ScreenSize.hp1,
                      }}
                      // onPress={() => getPic()}
                    ></Avatar>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const EmptyTab = () => {
    return (
      <>
        <Icons.FontAwesome5
          color="#ccc"
          name="user-clock"
          size={ScreenSize.hp1}
          style={{ alignSelf: 'center', marginTop: '10%' }}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: FontSize.font25,
            marginTop: '5%',
            color: 'gray',
            fontFamily: Fonts.Regular,
          }}>
          There are no early leavers.
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Five Star Multiservices"
        admin
        drawerIcon
        navigation={navigation}
        navigationDrawer={() => navigation.openDrawer()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        // stickyHeaderIndices={[4]}
      >
        <Text style={styles.heading}>Daily Attendance</Text>

        <View style={styles.datePickerView}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icons.FontAwesome
              name="calendar"
              color="gray"
              size={15}
              style={{ marginTop: '-3%' }}
            />
            <DatePicker
              defaultDate={new Date()}
              minimumDate={new Date(2018, 1, 1)}
              maximumDate={new Date(2099, 12, 31)}
              locale={'en'}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={'fade'}
              androidMode={'default'}
              placeHolderText={formatDate(new Date())}
              textStyle={{ color: '#101010', fontFamily: Fonts.Regular }}
              style={{ backgroundColor: 'red' }}
              placeHolderTextStyle={{
                color: '#101010',
                fontFamily: Fonts.Regular,
              }}
              onDateChange={() => setDate()}
              disabled={false}
            />
          </View>
          {/* {close == true && (
            <TouchableOpacity onPress={() => setDate('')}>
              <Icons.AntDesign name="close" color="gray" size={20} />
            </TouchableOpacity>
          )} */}
        </View>

        <PieChart />

        {/* <View style={styles.optMain}>
          {options.map((v, i) => {
            return (
              <View style={styles.optView}>
                <View
                  style={[
                    styles.colorView,
                    { backgroundColor: v.color },
                  ]}></View>
                <Text style={{ fontFamily: Fonts.Regular }}>{v.title}</Text>
              </View>
            );
          })}
        </View> */}

        <Tabs tabBarUnderlineStyle={{ height: 0, width: 0 }}>
          <Tab
            tabStyle={{ backgroundColor: '#747273' }}
            activeTabStyle={{ backgroundColor: '#fdac3e' }}
            textStyle={{ color: '#fff' }}
            heading="Present">
            <TabScreen />
          </Tab>
          <Tab
            activeTabStyle={{ backgroundColor: '#fdac3e' }}
            tabStyle={{ backgroundColor: '#747273', borderBottomWidth: 0 }}
            textStyle={{ color: '#fff' }}
            heading="Absent">
            <TabScreen />
          </Tab>
          <Tab
            activeTabStyle={{ backgroundColor: '#fdac3e' }}
            tabStyle={{ backgroundColor: '#747273' }}
            textStyle={{ color: '#fff' }}
            heading="Late Comers">
            <TabScreen />
          </Tab>
          <Tab
            activeTabStyle={{ backgroundColor: '#fdac3e' }}
            tabStyle={{ backgroundColor: '#747273' }}
            textStyle={{ color: '#fff' }}
            heading="Early Leavers">
            {/* <TabScreen /> */}
            <EmptyTab />
          </Tab>
        </Tabs>
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
  heading: {
    fontSize: FontSize.font3,
    textAlign: 'center',
    color: FontColor.green,
    paddingVertical: '1%',
    fontFamily: Fonts.SemiBold,
  },
  optMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: '1%',
  },
  optView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorView: { height: 12, width: 12, borderRadius: 12, marginRight: '5%' },
  item: {
    // backgroundColor: 'red',
    height: ScreenSize.hp05,
    // marginVertical: '2%',
    width: '90%',
    alignSelf: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    height: ScreenSize.hp05,
  },
  txt: {
    fontFamily: Fonts.SemiBold,
    color: FontColor.green,
    fontSize: FontSize.font25,
  },
  datePickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    borderTopColor: '#ccc',
    paddingHorizontal: '5%',
  },
  avatarView: {
    height: ScreenSize.hp15,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  userView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    paddingBottom: '2%',
    marginTop: '2%',
  },
  userName: {
    fontFamily: Fonts.Bold,
    letterSpacing: 1,
    marginTop: '2%',
  },
});

export default Settings;
