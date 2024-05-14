"use client";

import styles from "./page.module.scss";
import { FormEvent, useEffect, useRef } from "react";
import {
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { isValidEmail, isValidPassword } from "@/utils/matches";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";
import { NoSsr } from "@mui/base/NoSsr"; //handles classname missmatch warning

export default function Login({}) {
  const router = useRouter();
  const codeInputRef = useRef(null);

  const [key, setKey] = useState(1);
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [code, setCode] = useState("");
  const [isModealOpen, setIsModealOpen] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      setEmail(process.env.NEXT_PUBLIC_TEST_EMAIL ?? "");
      setPassword(process.env.NEXT_PUBLIC_TEST_PASSWORD ?? "");
    }
  }, []);

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

  async function handleRegister() {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
    console.log(response);
    const res = await response.json();
    console.log(res);
    if (response.ok) {
      setIsModealOpen(true);
    } else {
      setPasswordError(res.message ?? "Error while registering");
    }
  }

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
    console.log(response);
    if (response.ok) {
      router.push("/dashboard");
      console.log("SUCCESS");
    } else {
      setPasswordError("Email or password is incorrect");
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    if (validate()) {
      if (isRegistering) {
        await handleRegister();
      } else {
        await handleLogin();
      }
    }
    setIsLoading(false);
  };

  async function handleConfirmationCode(code: string) {
    setIsVerificationLoading(true);
    const response = await fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        code: code,
      }),
    });
    console.log(response);
    const res = await response.json();
    console.log(res);
    if (response.ok) {
      //router.push("/dashboard"); TODO
      setIsModealOpen(false);
    } else {
      setVerificationError(res.message ?? "Error while confirming");
      setCode("");
      setKey((a) => a + 1);
    }
    setIsVerificationLoading(false);
  }

  return (
    <main className={styles.main}>
      <div>
        <NoSsr>
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
            <Button onClick={() => setIsModealOpen(true)}>Verify</Button>
          </form>
        </NoSsr>
      </div>
      <Dialog open={isModealOpen}>
        <DialogTitle>Verify email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A verification code has been sent to your email. Please enter it
            below.
          </DialogContentText>
          <MuiOtpInput
            key={key}
            value={code}
            onChange={(a) => {
              setCode(a);
              setVerificationError("");
            }}
            TextFieldsProps={{
              disabled: isVerificationLoading,
            }}
            length={6}
            autoFocus
            validateChar={(a) => !isNaN(Number(a)) && a != " "}
            onComplete={(a) => handleConfirmationCode(a)}
          />
          <DialogContentText>{verificationError}</DialogContentText>
          <DialogActions>
            <Button onClick={() => setIsModealOpen(false)}>
              Send new code
            </Button>
            <Button onClick={() => setIsModealOpen(false)}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </main>
  );
}
