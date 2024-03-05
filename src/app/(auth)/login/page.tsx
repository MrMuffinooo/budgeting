"use client";

import { FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";

export default function Login({}) {
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("OK");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    // Handle response if necessary
    const data = await response.json();
    // ...
  }

  return (
    <main>
      <div>
        <form onSubmit={onSubmit}>
          <TextField
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            error={emailError !== " "}
            id="login-input"
            label="Login"
            variant="outlined"
            required
            fullWidth
            type="email"
            helperText={emailError}
          />
          <TextField
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            error={passwordError !== " "}
            id="password-input"
            label="Password"
            variant="outlined"
            required
            type="password"
            fullWidth
            helperText={passwordError}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isRegistering}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsRegistering(event.target.checked);
                }}
              />
            }
            label="Registration"
            labelPlacement="end"
          />
          <Button
            variant="contained"
            type="submit"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isRegistering ? "Register" : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
