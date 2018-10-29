import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Button, AsyncStorage, Alert } from 'react-native';

import Task from './app/components/Task';
import api from './services/api'

export default class App extends React.Component {



  state = {
    taskArray: [],
    taskText: '',
    errorMessage: null,
    loggedInUser: null,
    username: '',
    password: '',
  }

  signIn = async () => {
    try {
      const response = await api.post('/login', {
        username: this.state.username,
        password: this.state.password,
      });
      const { token } = response.data;
      console.log(token);
      
      await AsyncStorage.multiSet([
        ['@todoList:token', token]
      ]);
      console.log(token);
      this.getTasksList();
      this.setState({ loggedInUser: true })
    } catch (response) {
      this.setState({ errorMessage: 'dados invalidos' })
    }

  }

  getTasksList = async () => {
    console.log('GET TASK LIST');
    const token = await AsyncStorage.getItem('@todoList:token');
    try {
      const response = await api.get('/api/v1/todos',{},{headers: {'Authorization': `Token ${token}`}});
      console.log(response["data"]);
      const taskArray = response["data"];
      // const responseJson = await response.json();
      // console.log(`OLHA A DATA:${responseJson}`);
      this.setState({ taskArray });
      // console.log(`OLHA O ARRAY:${taskArray}`);
    } catch ( response ) {
      console.log(`PAPOCOU ${response}`);
      this.setState({ errorMessage: response.data.error })
    }
  }

  signOut = async () => {
    response = await api.delete('/logout');
    AsyncStorage.removeItem('@todoList:token');
    this.setState({ loggedInUser: null });
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('@todoList:token');
    if (token) {
      this.setState({ loggedInUser: true });
    }
  }

  render() {
    let tasks = this.state.taskArray.map((val, key) => {
      return <Task key={key} keyval={key} val={val} deleteMethod={() => this.deleteTask(val["id"])} />
    });

    return (
      <View style={styles.container}>
        {this.state.loggedInUser && <Text>{this.state.loggedInUser}</Text>}
        {this.state.errorMessage && <Text>{this.state.errorMessage}</Text>}
        {this.state.loggedInUser ?
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>- My ToDo-List -</Text>
              <Button style={styles.signoutButton} onPress={this.signOut} title="Sair"></Button>
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
                placeholder='Descreva aqui a Task' placeholderTextColor='white' underlineColorAndroid='transparent'>
              </TextInput>
            </View>
          </View>
          : <View style={styles.containerLogin}>
            {/* <Button onPress={this.signIn} title="Entrar"></Button> */}
            <Text style={styles.titleText}>TODO - LIST</Text>
            <TextInput
              value={this.state.username}
              keyboardType='email-address'
              onChangeText={(username) => this.setState({ username })}
              placeholder='Username'
              placeholderTextColor='white'
              style={styles.textInput}
            />
            <TextInput
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
              placeholder={'password'}
              secureTextEntry={true}
              placeholderTextColor='white'
              style={styles.textInput}
            />


            <TouchableOpacity
              style={styles.button}
              onPress={this.signIn}
            >
              <Text style={styles.buttonText}> Entrar </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }

  addTask= async () => {
    const token = await AsyncStorage.getItem('@todoList:token');
    try {
      if (this.state.taskText) {
      const response = await api.post('/api/v1/todos',{
        todo: {description: this.state.taskText }},
              {headers: {'Authorization': `Token ${token}`}});
      }
      this.getTasksList();
    } catch ( response ) {
      this.setState({ errorMessage: response.data.error })
    }
  }

  deleteTask = async(key) => {
    const token = await AsyncStorage.getItem('@todoList:token');
    try {
      const response = await api.delete(`/api/v1/todos/${key}`,{},
              {headers: {'Authorization': `Token ${token}`}});
      this.getTasksList();
    }catch (response) {
      this.setState({ errorMessage: response.data.error })
    }
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
  signoutButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    left: 0,
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
  },
  input: {
    width: 200,
    fontSize: 20,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 10,
  },



});
