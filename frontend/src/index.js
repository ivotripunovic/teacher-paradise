import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createStudent, getStudents, getStudent } from "./api";
import { Dates } from "./components/dates";
import "./index.css";
import parse from "date-fns/parse";
import { FixedSizeList as List } from "react-window";
import { auth } from './auth';

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
      <Statistic />
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
    </div>
  );

  return (
    <div className="box">
      <span>Students</span>
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const Statistic = () => {
  return <div className="box">Statistic</div>;
};

ReactDOM.render(auth(false, <Main />), document.getElementById("root"));
