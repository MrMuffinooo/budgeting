"use client";

import styles from "./page.module.scss";
import { FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { isValidEmail, isValidPassword } from "@/utils/matches";
import { useRouter } from "next/navigation";

export default function Login({}) {
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(" ");
    }
    if (isRegistering && !isValidPassword(password)) {
      setPasswordError("Password is too weak");
    } else {
      setPasswordError(" ");
    }
    return passwordError === " " && emailError === " ";
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      const response = await fetch("/api/login", {
        method: "POST",
      });
      console.log(response);
      if (response.ok) {
        router.push("/dashboard");
      } else {
        setPasswordError("Email or password is incorrect");
      }
    }
    setIsLoading(false);
  };

  return (
    <main className={styles.main}>
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
