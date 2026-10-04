import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    setUserToken(token);
                }
            } catch (e) {
                console.error('Failed to load token:', e);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);

const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password});
    const { token } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    setUserToken(token);
};

const register = async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { token } = response.data;
    await SecureStore.setItemAsync('userToken', token);
    setUserToken(token);
};

const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null);
};

return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout,}}>
        {children}
    </AuthContext.Provider>
);
};