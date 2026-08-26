import api from './api'; 

export const customerService = {
  
  getUsers: (signal) => {
  
    return api.get(import.meta.env.VITE_COMPLETE_DATA_URL,{signal}); 
  },

  getUserById: (id,signal) => {
    return api.get(`/users/${id}, { signal }`);
  }
};
