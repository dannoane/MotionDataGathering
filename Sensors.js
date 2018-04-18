import { Accelerometer, Gyroscope, Magnetometer } from "react-native-sensors";
import { store } from './Store';
import Storage from './Storage';
import { incrementId } from './Action';
import Rx from 'rxjs/Rx';
import KeepAwake from 'react-native-keep-awake';

let accelerationObservable = null;
let gyroscopeObservable = null;
let magnetometerObservable = null;

let subscription;

store.subscribe(async () => {

  let state = store.getState();

  if (state.collectData && !observablesAvailable()) {
    await createObservables();
    mergeObservablesAndSubscribe();
    KeepAwake.activate();
  }
  else if (!state.collectData && observablesAvailable()) {
    destroyObservables();
    KeepAwake.deactivate();
  }
});

function observablesAvailable() {

  return accelerationObservable !== null && gyroscopeObservable !== null && magnetometerObservable !== null;
}

async function createObservables() {

  accelerationObservable = await new Accelerometer({ updateInterval: 100 });
  gyroscopeObservable = await new Gyroscope({ updateInterval: 100 });
  magnetometerObservable = await new Magnetometer({ updateInterval: 100 });
}

function mergeObservablesAndSubscribe() {

  let uberObservable = accelerationObservable
    .withLatestFrom(gyroscopeObservable, magnetometerObservable,
      (accelerometer, gyroscope, magnetometer) =>
        ({ accelerometer, gyroscope, magnetometer, position: { speed: 0, heading: 0 } }));

  subscription = uberObservable
    .map(data => Object.assign({}, data, { activity: store.getState().activity }))
    .bufferCount(100)
    .skip(1)    
    .skipLast(2)
    .subscribe(async (data) => {

      if (data.length < 100) {
        return;
      }

      store.dispatch(incrementId());

      await Storage.setData(data);
    });
}

function destroyObservables() {

  subscription.unsubscribe();

  accelerationObservable.stop();
  gyroscopeObservable.stop();
  magnetometerObservable.stop();

  accelerationObservable = null;
  gyroscopeObservable = null;
  magnetometerObservable = null;
}
