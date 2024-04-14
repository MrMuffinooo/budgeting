"use client";

import styles from "./page.module.scss";
import { FormEvent, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { isValidEmail, isValidPassword } from "@/utils/matches";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function Login({}) {
  const router = useRouter();
  const codeInputRef = useRef(null);

  const [key, setKey] = useState(1);
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [email, setEmail] = useState(process.env.TEST_EMAIL ?? "email"); //TODO
  const [password, setPassword] = useState(
    process.env.TEST_PASSWORD ?? "password"
  ); //TODO
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [code, setCode] = useState("");
  const [isModealOpen, setIsModealOpen] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

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
    });
    console.log(response);
    if (response.ok) {
      router.push("/dashboard");
    } else {
      setPasswordError("Email or password is incorrect");
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const isValid = true; //TODO validate();
    if (isValid) {
      if (!isRegistering) {
        await handleLogin();
      } else {
        await handleRegister();
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
      <Dialog open={isModealOpen} onClose={() => setIsModealOpen(false)}>
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
        </DialogContent>
      </Dialog>
    </main>
  );
}
