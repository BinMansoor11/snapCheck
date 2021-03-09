import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/stackNavigator';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import { StatusBar } from 'react-native';

function App(props) {
  useEffect(() => {
    RNBootSplash.hide({ duration: 1000 });
  });

  return (
    <>
      {/* <StatusBar hidden /> */}
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
