import axios from 'axios';
import { getToken } from './AuthService';

const API_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/contacts`
    : 'http://localhost:8080/contacts';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export async function saveContact(contact) {
    return await axios.post(API_URL, contact, authHeaders());
}

export async function getContacts(page = 0, size = 10) {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`, authHeaders());
}

export async function getContact(id) {
    return await axios.get(`${API_URL}/${id}`, authHeaders());
}

export async function updateContact(contact) {
    return await axios.post(API_URL, contact, authHeaders());
}

export async function updatePhoto(formData) {
    return await axios.put(`${API_URL}/photo`, formData, authHeaders());
}

export async function deleteContact(id) {
    return await axios.delete(`${API_URL}/${id}`, authHeaders());
}
