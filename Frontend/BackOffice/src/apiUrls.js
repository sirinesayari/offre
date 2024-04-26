/* eslint-disable */

const BASE_URL = "http://localhost:5000";

const API_URLS = {
  addUser: `${BASE_URL}/user/add`,   // Ajoutez d'autres URL ici
  getUsers:`${BASE_URL}/user/getall`,
  signup: `${BASE_URL}/user`,
  checkEmail:`${BASE_URL}/user/checkEmail`, 
  userRoleStatistics: `${BASE_URL}/user/userRoleStatistics`,
  totalUsers: `${BASE_URL}/user/totalUsers`,
  sortUsers: `${BASE_URL}/user/sort`,
  getAllUsers: `${BASE_URL}/user/getall`,
  deleteUser: (userId) => `${BASE_URL}/user/deleteUser/${userId}`,
  searchUsers: `${BASE_URL}/user/search`,
  updateUser: (userId) => `${BASE_URL}/user/updateUser/${userId}`,
  getUserById: (userId) => `${BASE_URL}/user/get/${userId}`, 
  uploadCV: (userId) => `${BASE_URL}/user/uploadCV/${userId}`,
  uploadAvatar: `${BASE_URL}/user/uploadAvatar`,

};

export default API_URLS;
