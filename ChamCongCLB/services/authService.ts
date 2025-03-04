import api from './api';

export interface LoginBody {
    username: string;
    password: string;
}

/**
 * The login API call
 * @param user - The user object containing the username and password
 * @returns The response from the API
 */

export const loginAPI = async (user : LoginBody) => {
    return api.post('/auth/login', {
        username: user.username,
        password: user.password
    });
}

