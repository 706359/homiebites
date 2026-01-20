import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../lib/api';

const TOKEN = 'homiebites_token';
const ADMIN = 'homiebites_admin';
const USER = 'homiebites_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStored = async () => {
    try {
      const [t, u] = await Promise.all([
        AsyncStorage.getItem(TOKEN),
        AsyncStorage.getItem(USER),
      ]);
      setToken(t || null);
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStored();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const u = res.user || {};
    await AsyncStorage.multiSet([
      [TOKEN, res.token],
      [ADMIN, 'true'],
      [USER, JSON.stringify(u)],
    ]);
    setToken(res.token);
    setUser(u);
    return res;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([TOKEN, ADMIN, USER]);
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    const r = (user?.role || '').toLowerCase();
    return r === 'admin';
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
