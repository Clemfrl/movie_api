import React, { useState } from "react";
import axios from "axios";

export function RegistrationView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://chrisflix.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: dob,
      })
      .then((response) => {
        const data = response.data;
        alert("Your account has been created! Please login");
        console.log(data);
        window.open("/client", "_self");
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  };

  return (
    <form>
      <label>
        Username:
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Email adress:
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          placeholder="22/10/1991"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </label>
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}
