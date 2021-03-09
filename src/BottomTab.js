import React, { useEffect, PureComponent } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Icons from './components/icons';
import { HomeScreen, Settings, ChangePassword, Profile } from './screens';
import { connect } from 'react-redux';
import { FontColor } from './components/theme';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler, Alert } from 'react-native';

const Tab = createBottomTabNavigator();

const SettingsStack = createStackNavigator();

function SettingsStackScreen(props) {
  return (
    <SettingsStack.Navigator headerMode="none" initialRouteName="Settings">
      <SettingsStack.Screen name="Settings" component={Settings} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePassword} />
    </SettingsStack.Navigator>
  );
}

class BottomTab extends PureComponent {
  componentDidMount() {
    console.log('PROPS_BOTTOMTAB', this.props);
  }

  render() {
    const { navigation } = this.props;
    console.log('PROPPPSS', this.props);
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeScreen') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'user' : 'user';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog';
            }

            // You can return any component that you like here!
            return <Icons.Entypo name={iconName} size={30} color={color} />;
          },
        })}
        tabBarOptions={{
          showLabel: false,
          activeTintColor: '#fff',
          inactiveTintColor: 'rgba(228, 233, 237, 0.8)',
          style: { height: 50, backgroundColor: FontColor.green },
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          navigation={navigation}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          // navigation={navigation}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackScreen}
          {...this.props}
        />
        {/* <Tab.Screen name="Settings2" component={Settings} {...this.props} /> */}
      </Tab.Navigator>
    );
  }
}

export default connect()(BottomTab);
