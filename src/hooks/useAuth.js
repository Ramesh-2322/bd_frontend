import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('bdms_token'));
  const [username, setUsername] = useState(localStorage.getItem('bdms_user'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('bdms_token', token);
    } else {
      localStorage.removeItem('bdms_token');
    }
  }, [token]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('bdms_user', username);
    } else {
      localStorage.removeItem('bdms_user');
    }
  }, [username]);

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return { token, setToken, username, setUsername, logout };
}
