import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const FontColor = {
  // red: '#008ecc',
  purple: '#e119da',
  background: 'rgba(83,0,38,0.6)',
  blue: '#28a8e9',
  green: '#055DDE',
  lightBlue: '#7476FF',
  success: '#2ca089',
};
export const Pic = {
  User: require('../../assets/user.png'),
  Splash: require('../../assets/Splash.png'),

  //giphy: ~10 mbs ,  gif: ~3 mbs
  GifLogin: require('../../assets/gif2.gif'),
};
export const Fonts = {
  SemiBold: 'Poppins-Medium',
  Light: 'Poppins-Light',
  Regular: 'Poppins-Regular',
  Bold: 'Poppins-SemiBold',
};

export const FontSize = {
  font1: RFPercentage(1),
  font15: RFPercentage(1.5),
  font16: RFPercentage(1.6),
  font17: RFPercentage(1.7),
  font2: RFPercentage(2),
  font22: RFPercentage(2.2),
  font25: RFPercentage(2.5),
  font3: RFPercentage(3),
  font4: RFPercentage(4),
  font5: RFPercentage(5),
  font6: RFPercentage(6),
  font7: RFPercentage(7),
  font8: RFPercentage(8),
  font9: RFPercentage(9),
  font10: RFPercentage(10),
};
export const ScreenSize = {
  hp03: hp('3%'),
  hp04: hp('4%'),
  hp05: hp('5%'),
  hp07: hp('7%'),
  hp06: hp('6%'),
  hp065: hp('6.5%'),
  hp08: hp('8%'),
  hp09: hp('9%'),
  hp1: hp('10%'),
  hp12: hp('12%'),
  hp15: hp('15%'),
  hp2: hp('20%'),
  hp22: hp('22%'),
  hp25: hp('25%'),
  hp3: hp('30%'),
  hp35: hp('35%'),
  hp4: hp('40%'),
  hp42: hp('42%'),
  hp43: hp('43%'),
  hp45: hp('45%'),
  hp5: hp('50%'),
  hp6: hp('60%'),
  hp7: hp('70%'),
  hp8: hp('80%'),
  hp9: hp('90%'),
  hp10: hp('100%'),
};

export const ScreenWidth = {
  wp05: wp('5%'),
  wp07: wp('7%'),
  wp06: wp('6%'),
  wp08: wp('8%'),
  wp09: wp('9%'),
  wp1: wp('10%'),
  wp12: wp('12%'),
  wp2: wp('20%'),
  wp22: wp('22%'),
  wp25: wp('25%'),
  wp3: wp('30%'),
  wp35: wp('35%'),
  wp4: wp('40%'),
  wp45: wp('45%'),
  wp5: wp('50%'),
  wp6: wp('60%'),
  wp7: wp('70%'),
  wp8: wp('80%'),
  wp9: wp('90%'),
  wp10: wp('100%'),
};
