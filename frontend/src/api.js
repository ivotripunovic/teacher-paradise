import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const STUDENT_PATH = "/students";
const USER_PATH = "/users";

export const getStudents = () => axios.get(STUDENT_PATH);

export const createStudent = name => axios.post(STUDENT_PATH, { name });

export const getStudent = id => axios.get(STUDENT_PATH + `/${id}`);

export const updateStudent = ({ id, name }) =>
  axios.put(STUDENT_PATH + `/${id}`, { id, name });

export const deleteStudent = id =>
  axios.delete(STUDENT_PATH + `/${id}`)

export const addClassDate = ({ studentId, date }) =>
  axios.post(STUDENT_PATH + `/${studentId}/dates/${date}`);

export const deleteClassDate = ({ studentId, date }) =>
  axios.delete(STUDENT_PATH + `/${studentId}/dates/${date}`);

export const createUser = user => axios.post(USER_PATH, user);

export const login = user => {
  const promise = axios.post('/login', user);
  promise.then((response) => {
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    })
    .catch(e => {
      axios.defaults.headers.common.Authorization = '';
    });
  return promise;
};
