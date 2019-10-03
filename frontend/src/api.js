import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const STUDENT_PATH = "/students";

export const getStudents = () => axios.get(STUDENT_PATH);

export const createStudent = name => axios.post(STUDENT_PATH, { name });
