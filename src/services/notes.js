import axios from "axios";
// const baseUrl = "http://localhost:3001/api/notes";
// const baseUrl = "https://sleepy-jade-lapel.cyclic.app/api/notes";
const baseUrl = "/api/notes";

let token = null

const setToken = (newToken)=>{
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// // simulate the response is an empty array as the request id was removed from the server
// const getAll = () => {
//   const request = axios.get(baseUrl);
//   const nonExisting = {
//     id: 10000,
//     content: "This note is not saved to server",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   };
//   return request.then((response) => response.data.concat(nonExisting));
// };

const create = async(newObject) => {
  const config = {
    headers: {Authorization: token}
  }
  const response = await axios.post(baseUrl, newObject, config);
  return response.data
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAll, create, update, setToken };
