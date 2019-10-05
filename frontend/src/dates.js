import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const Dates = ({ student }) => {
  const [date] = useState(new Date());

  return (
    <div>
      {!student && <span>Please select student</span>}
      {student && (
        <div>
          <h1>Class dates for {student.name}</h1>
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
