import api from './api';

export interface LoginBody {
    username: string;
    password: string;
}

/**
 * The loginAPI call
 * @param user - The user object containing the username and password
 * @returns The response from the API
 */

export const loginAPI = async (user : LoginBody) => {
    return api.post('/auth/login', {
        username: user.username,
        password: user.password
    });
}

/**
 * The meAPI call
 * @returns - The response from the API
 */
export const meAPI = async () => {
    return api.get('/user/me');
}