import React from "react";

const handleSubmit = event => {
  event.preventDefault();
  alert("Comming soon");
};

export const Login = () => {
  return (
    <form onSubmit={handleSubmit}>
      <h1>Login below</h1>
      <input type="email" name="email" placeholder="Enter email" required />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

