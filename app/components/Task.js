import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Moment from 'moment';

export default class App extends React.Component {
  render() {
    return (
      <View key={this.props.keyval} style={styles.task}>
       
        <Text style={this.props.val["done"] ? styles.taskDone : styles.taskText}>{Moment(this.props.val["created_at"]).format('L')}</Text>
        <Text style={this.props.val["done"] ? styles.taskDone : styles.taskText}>{this.props.val["description"]}</Text>
        <TouchableOpacity onPress={() => this.props.deleteMethod(this.props.val["id"])} style={styles.taskDelete}>
            <Text style={styles.taskDeleteText}>X</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  task: {
      position: 'relative',
      padding: 20,
      paddingRight: 100,
      borderBottomWidth: 2,
      borderBottomColor: '#ededed',

  },
  taskText: {
      paddingLeft: 20,
      borderLeftWidth: 10,
      borderLeftColor: '#E91E63',
    },
    taskDone: {
      paddingLeft: 20,
      borderLeftWidth: 10,
      borderLeftColor: '#999966',
      color: '#999966',
    },
    taskDelete: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2980b9',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10,
    },
    taskDeleteText: {
        color: 'white'

    },
});
