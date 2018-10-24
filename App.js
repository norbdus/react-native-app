import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Button, AsyncStorage, Alert } from 'react-native';

import Task from './app/components/Task';
import api from './services/api'

export default class App extends React.Component {

  state = {
    taskArray: [{ 'task': 'teste task' }],
    taskText: '',
    errorMessage: null,
    loggedInUser: null,
  }

  signIn = async () => {
    try {
      const response = await api.post('/login', {
        username: 'norbdus',
        password: '12345678'
      });
      const { token } = response.data;
      console.log(token);

      await AsyncStorage.multiSet([
        ['@todoList:token', token]
      ]);
      this.setState({ loggedInUser: true })
    } catch (response) {
      this.setState({ errorMessage: 'dados invalidos' })
    }

  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('@todoList:token');
    if (token) {
      this.setState({ loggedInUser: true })
    }
  }

  render() {
    let tasks = this.state.taskArray.map((val, key) => {
      return <Task key={key} keyval={key} val={val} deleteMethod={() => this.deleteTask(key)} />
    });

    return (
      <View style={styles.containerLogin}>
        {this.state.loggedInUser && <Text>{this.state.loggedInUser}</Text>}
        {this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}
        {this.state.loggedInUser ?
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>- NOTER -</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
              {tasks}
            </ScrollView>
            <View style={styles.footer}>

              <TouchableOpacity onPress={this.addTask.bind(this)} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>

              <TextInput style={styles.textInput}
                onChangeText={(taskText) => this.setState({ taskText })} value={this.state.tasktext}
                placeholder='> task' placeholderTextColor='white' underlineColorAndroid='transparent'>
              </TextInput>
            </View>
          </View>
          : <View style={styles.containerLogin}>
            <Button onPress={this.signIn} title="Entrar"></Button>
          </View>}
      </View>
    );
  }

  addTask() {
    if (this.state.taskText) {
      var d = new Date();
      this.state.taskArray.push({ date: d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(), 'task': this.state.taskText })
      this.setState({ taskArray: this.state.taskArray })
      this.setState({ taskText: '' })
    }
  }

  deleteTask(key) {
    this.state.taskArray.splice(key, 1);
    this.setState({ taskArray: this.state.taskArray })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100,
  },
  footer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButton: {
    backgroundColor: '#E91E63',
    width: 90,
    height: 90,
    borderRadius: 50,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    marginBottom: -45,
    zIndex: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  textInput: {
    alignSelf: 'stretch',
    color: '#fff',
    padding: 20,
    paddingTop: 46,
    backgroundColor: '#252525',
    borderTopWidth: 2,
    borderTopColor: '#ededed',
  }



});
