export const saveUser = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };
  
  export const isLoggedIn = () => !!localStorage.getItem('token');
  