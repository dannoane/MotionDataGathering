import React, { Component } from 'react';
import { Text, View, Picker, Button, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { collectData, setActivity } from './Action';
import Sensors from './Sensors';
import Storage from './Storage';
import Networking from './Networking';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      uploading: false
    };
  }

  async uploadData() {

    this.setState({ uploading: true });

    let success, data, allData;

    allData = await Storage.getData();

    for (let i = 0; ; i += 50) {
      data = allData.slice(i, i + 50);
      data = data.map(d => ({
        id: d.id,
        accelerometer: d.accelerometer,
        gyroscope: d.gyroscope,
        magnetometer: d.magnetometer,
        position: d.position,
        activity: d.activity
      }));

      if (data.length === 0) {
        break;
      }
      
      success = false;
      do {
        success = await Networking.uploadData(JSON.stringify(data));
      } while (!success);
    }

    await Storage.clearStorage();

    this.setState({ uploading: false });    
  }
  
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Motion Data Gathering!
        </Text>
        
        <Text style={styles.instructions}>
          Before collectiong data select the activity for which the data is collected
        </Text>
        
        <Text style={styles.instructions}>
          Activity:
        </Text>
        
        <Picker
          style={{height: 100, width:120}}
          selectedValue={this.props.activity}
          onValueChange={(itemValue, itemIndex) => this.props.onActivity(itemValue)}>
          <Picker.Item label="Walking" value="walking" />
          <Picker.Item label="Running" value="running" />
          <Picker.Item label="Biking" value="biking" />
          <Picker.Item label="Stationary" value="stationary" />
        </Picker>
        
        <Button
          title={this.props.collectData ? "Stop Collecting" : "Collect Data"}
          onPress={() => this.props.onCollectData(!this.props.collectData)} />
        
        <Button
          title={"Upload Data"}
          disabled={this.state.uploading}
          onPress={() => this.uploadData()} />

        <Text>
          {`${this.props.id}`}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => ({
  collectData: state.collectData,
  activity: state.activity,
  id: state.id
});

const mapDispatchToProps = {
  onActivity: setActivity,
  onCollectData: collectData
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
