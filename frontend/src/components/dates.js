import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import "../index.css";
import { addClassDate, deleteClassDate } from "../api";
import format from "date-fns/format";

export const Dates = ({ student, setStudent }) => {
  const handleOnChange = async date => {
    const dateString = format(date, "yyyy-MM-dd");
    if (student.dates.find(x => x.getTime() === date.getTime())) {
      try {
        await deleteClassDate({ studentId: student.id, date: dateString });
        student.dates = student.dates.filter(
          x => x.getTime() !== date.getTime()
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await addClassDate({ studentId: student.id, date: dateString });
        student.dates = [...student.dates, date];
        student.dates.sort((o1, o2) => o1.getTime() - o2.getTime());
      } catch (err) {
        console.log(err);
      }
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
