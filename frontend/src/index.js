import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { createStudent, getStudents } from "./api";

const Main = () => {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState("");

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
    <div>
      {error && <span>** Erorr: {error}</span>}
      <Students
        students={students}
        setError={setError}
        setStudents={setStudents}
      />
      <Dates />
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

const Students = ({ students, setStudents, setError }) => {
  return (
    <div>
      [Students]
      <ul>
        {students &&
          Object.values(students).map((x, id) => <li key={id}>{x.name}</li>)}
        {!students && <span>Please add student</span>}
      </ul>
      <form onSubmit={e => handleSubmit(students, setStudents, setError)(e)}>
        <label>Name:</label>
        <input type="text" name="name" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

const Dates = () => {
  return <div>Dates...</div>;
};

const Statistic = () => {
  return <div>Statistic</div>;
};

ReactDOM.render(<Main />, document.getElementById("root"));
