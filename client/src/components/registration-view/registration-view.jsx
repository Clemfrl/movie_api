import React, { useState } from "react";

export function RegistrationView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
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
