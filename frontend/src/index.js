import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createStudent, getStudents, getStudent, login, deleteStudent } from "./api";
import { Dates } from "./components/dates";
import "./index.css";
import parse from "date-fns/parse";
import { FixedSizeList as List } from "react-window";
import { Login } from "./components/login";
import { Statistic } from "./components/statistic";

const loginSubmit = (setLogin, setError) => e => {
  e.preventDefault();
  const user = e.target.user.value;
  const pass = e.target.pass.value;
  login({ user, pass })
    .then(() => setLogin(true))
    .catch(e => setError(e.response.statusText));
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState([]);

  if (!loggedIn) {
    return (
      <Login handleSubmit={loginSubmit(setLoggedIn, setError)} error={error} />
    );
  }

  return <Main />;
};

const handleSelect = async (student, setStudent) => {
  let s = await getStudent(student.id);
  s = s.data;
  // deserialize date from string
  s.dates = s.dates.map(d => parse(d, "yyyy-MM-dd", new Date()));
  setStudent(s);
};

const Main = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="content">
      {error && <span>** Erorr: {error}</span>}
      <Students
        students={students}
        setError={setError}
        setStudents={setStudents}
        handleSelect={handleSelect}
        setSelectedStudent={setSelectedStudent}
      />
      <Dates student={selectedStudent} setStudent={setSelectedStudent} />
      <Statistic student={selectedStudent} />
    </div>
  );
};

const handleSubmit = (students, setStudents, setError) => async event => {
  event.preventDefault();

  const name = event.target.name.value;
  try {
    const result = await createStudent(name);
    setStudents([...students, result.data]);
  } catch (error) {
    setError("Cound not create " + name, " " + error.message);
  }
};

const handleDeleteStudent = async (student, setStudents, students, setError, setSelectedStudent) => {
  if (!window.confirm('Do you want to delete: ' + student.name + ' ?')) {
    return;
  }
  try {
    await deleteStudent(student.id);
    console.log('yea ' + student.id)
    setStudents(students.filter(item => item.id !== student.id))
    setSelectedStudent(null)
  } catch(error) {
    setError("Cound not delete " + student.name, " " + error.message);
  }
}

const Students = ({
  students,
  setStudents,
  setError,
  handleSelect,
  setSelectedStudent
}) => {
  const Row = ({ data, index, style }) => (
    <div style={style}>
      {data[index].name}{" "}
      <button onClick={() => handleSelect(data[index], setSelectedStudent)}>
        >
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={() => handleDeleteStudent(data[index], setStudents, students, setError, setSelectedStudent)}>X</button>

    </div>
  );

  return (
    <div className="box">
      <h3>Students</h3>
      {students && (
        <List
          height={450}
          itemCount={students.length}
          itemSize={35}
          width={300}
          itemData={students}
        >
          {Row}
        </List>
      )}

      {!students && <span>Please add student</span>}
      <form onSubmit={e => handleSubmit(students, setStudents, setError)(e)}>
        <label>Name:</label>
        <input type="text" name="name" />
        <input type="submit" value="Add" />
      </form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
