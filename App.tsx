import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Grid from './components/grid/Grid';
import { Provider } from 'react-redux'
import store from './store';

export default function App() {
  return (

    <Provider store={store} >
      <SafeAreaView style={styles.container}>
        <Grid />
      </SafeAreaView>
    </Provider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff'
  },
  gameView: {
    flexGrow: 1,
    backgroundColor: '#fff',
    position: 'relative'
  }
});
