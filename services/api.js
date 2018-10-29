import { AsyncStorage } from 'react-native';
import { create } from 'apisauce';

const api = create({
    baseURL: 'https://tasks-manager-vitorio.herokuapp.com/',
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