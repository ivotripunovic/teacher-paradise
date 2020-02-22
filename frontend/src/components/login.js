import React from "react";
import {login} from "../api";

export const Login = ({setLogin}) => {  

  let authError = "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = e.target.user.value;
    const pass = e.target.pass.value;
    login({user, pass})
      .then(e => setLogin(true))
      .catch(e => {
        console.log(e);
        authError = e;
        setLogin(false);
      });    
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login below</h1>
      {authError}
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