import { AsyncStorage } from 'react-native';
import { create } from 'apisauce';

const api = create({
    baseURL: 'http://192.168.42.143:3000',
});

api.addAsyncRequestTransform(request => async () =>{
    const token = await AsyncStorage.getItem('@CodeApi:token');

    if(token){
        request.headers['Authorization'] = `Token ${token}`
    }
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;