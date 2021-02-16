import axios from 'axios';
import bcrypt from 'bcryptjs';

export const UserRegistration = data => {
    return axios.post('http://localhost:4000/register', data)
        .then(res => res.status);
};

export const UserEdit = data => {
    return axios.put('http://localhost:4000/edit', data)
        .then(res => res.status);
}
