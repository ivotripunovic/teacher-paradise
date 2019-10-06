import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import "./index.css";

export const Dates = ({ student }) => {
  const [date] = useState(new Date());

  return (
    <div className="box">
      {!student && <span>Please select student</span>}
      {student && (
        <div>
          <span>Class dates for {student.name}</span>
          <DatePicker inline selected={date} />
          {student.dates && (
            <ul>
              {student.dates.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
