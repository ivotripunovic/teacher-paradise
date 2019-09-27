import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';

// const studentsStub = {
//   0: {'name': 'Ivo', 'dates': ['2019-12-03']},
//   1: {'name': 'Tana', 'dates': []},
//   2: {'name': 'Natalija', 'dates': []}
// }

axios.defaults.baseURL = 'http://localhost:5000';

const Main = () => {
  const [students, setStudents] = useState(null);

  const fetchStudents = async () => {
     const response = await axios.get("/students");
     const responseOk = response && response.status === 200;
     if (responseOk) {
       setStudents(await response.data);
     }
//    setStudents(studentsStub);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <Students students={students} />
      <Dates />
      <Statistic />
    </div>
  );
};

const Students = ({ students }) => {
  return (
    <div>
      [Students]
      <ul>
        {students && Object.values(students).map((x, id) => <li key={id}>{x.name}</li>)}
        {!students && <span>Please add student</span>}
      </ul>
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
