import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export async function login(username, password) {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    return res.data.token;
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isLoggedIn() {
    return !!getToken();
}
