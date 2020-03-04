import React from "react";

export const Login = ({ handleSubmit, error }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h1>Login below</h1>
      {error}
      <input name="user" placeholder="username" required />
      <input
        type="password"
        name="pass"
        placeholder="Enter password"
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
};
