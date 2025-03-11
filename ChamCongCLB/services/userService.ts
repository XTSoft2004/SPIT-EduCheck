import api from './api';

export const getAllUsers = () => {
    return api.get('/user');
}

