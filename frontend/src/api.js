import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const STUDENT_PATH = "/students";

export const getStudents = () => axios.get(STUDENT_PATH);

export const createStudent = name => axios.post(STUDENT_PATH, { name });

export const getStudent = id => axios.get(STUDENT_PATH + `/${id}`);

export const updateStudent = ({ id, name }) =>
  axios.put(STUDENT_PATH + `/${id}`, { id, name });

export const addClassDate = ({ studentId, date }) =>
  axios.post(STUDENT_PATH + `/${studentId}/dates/${date}`);

export const deleteClassDate = ({ studentId, date }) =>
  axios.delete(STUDENT_PATH + `/${studentId}/dates/${date}`);
