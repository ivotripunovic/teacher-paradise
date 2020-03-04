import React from "react";

export const Statistic = ({ student }) => {
  const stats = countAttendings(student);

  return (
    <div className="box">
      <h3>Statistic</h3>
      <ul>
        {stats.map(e => (
          <li key={e[0]}>
            {toMonth(e[0])} - {e[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const countAttendings = student => {
  if (!student) {
    return [];
  }
  const dates = student.dates.map(d => new Date(d));
  const result = new Map();

  for (let d of dates) {
    const key = d.getFullYear() * 100 + d.getMonth();
    let value = result.get(key);
    if (value === undefined) {
      value = 0;
    }
    value += 1;
    result.set(key, value);
  }
  
  return Array.from(result).sort((a,b) => b[0]-a[0]);
};

const toMonth = yearMonth => {
  const m = yearMonth % 100;
  const y = Math.floor(yearMonth / 100);
  const month = new Date(y, m, 1).toLocaleString("default", {
    month: "long"
  });
  return y + ". " + month;
};
