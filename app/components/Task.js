import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View key={this.props.keyval} style={styles.task}>
       
        <Text style={styles.taskText}>{this.props.val.date}</Text>
        <Text style={styles.taskText}>{this.props.val.task}</Text>

        <TouchableOpacity onPress={this.props.deleteMethod} style={styles.taskDelete}>
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
