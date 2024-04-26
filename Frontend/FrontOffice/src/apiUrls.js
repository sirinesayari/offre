/* eslint-disable */

const BASE_URL = "http://localhost:5000";

const API_URLS = {
  signup: `${BASE_URL}/user`,
  login: `${BASE_URL}/user/login`,
  logind: `${BASE_URL}/user/logind`,

  addUser: `${BASE_URL}/user/add`,   // Ajoutez d'autres URL ici
  auth: `${BASE_URL}/auth`, 
  authd: `${BASE_URL}/auth/dash`, 

  google: `${BASE_URL}/auth/google`, 
  reset: `${BASE_URL}/password-reset`,
  checkEmail:`${BASE_URL}/user/checkEmail`, 
  upload:`${BASE_URL}/messages/upload`,
//  verifyUser: (param) => `${BASE_URL}/user/${param.id}/verify/${param.token}`,
deleteChatRoom: (chatId) => `${BASE_URL}/chat/deleteChatRoom/${chatId}`,
deleteMessage: (messageId) => `${BASE_URL}/messages/deleteMessage/${messageId}`,
getAllUsers: `${BASE_URL}/user/getall`,
createChat: `${BASE_URL}/chat/`,
sortUsers: `${BASE_URL}/user/sort`,
searchUsers: `${BASE_URL}/user/search`,
uploadAvatar: `${BASE_URL}/user/uploadAvatar`,
getUserById: (userId) => `${BASE_URL}/user/get/${userId}`, 
updateUser: (userId) => `${BASE_URL}/user/updateUser/${userId}`,
uploadCV: (userId) => `${BASE_URL}/user/uploadCV/${userId}`,
reactToMessage: `${BASE_URL}/messages/reactToMessage`,
unreactToMessage: `${BASE_URL}/messages/unreactToMessage`,

};

export default API_URLS;
