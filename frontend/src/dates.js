import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import "./index.css";

export const Dates = ({ student, setStudent }) => {
  const handleOnChange = date => {
    if (student.dates.find(x => x.getTime() === date.getTime())) {
      student.dates = student.dates.filter(x => x.getTime() !== date.getTime());
    } else {
      student.dates = [...student.dates, date];
      student.dates.sort((o1, o2) => o1.getTime() - o2.getTime());
    }
    // Need to create new instance for the state
    const newstudent = {
      id: student.id,
      name: student.name,
      dates: student.dates
    };

    setStudent(newstudent);
  };

  return (
    <div className="box">
      {!student && <span>Please select student</span>}
      {student && (
        <div>
          <span>Class dates for {student.name}</span>
          <DatePicker
            inline
            openToDate={new Date()}
            highlightDates={student.dates}
            onChange={handleOnChange}
          />
          {student.dates && (
            <ul>
              {student.dates.map((d, key) => (
                <li key={key}>{d.toLocaleDateString()}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
