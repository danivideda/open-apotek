"use client";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "./actions";
import { useEffect, useState } from "react";

type errors = { username: string; password: string };

export default function Login() {
  const [state, formAction] = useFormState(register, null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({} as errors);
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    let errors: errors = {} as errors;

    if (username.length >= 1 && username.length < 4) {
      errors.username = "Username must contain at least 4 character(s)";
    }

    if (password.length >= 1 && password.length < 4) {
      errors.password = "Password must contain at least 4 character(s)";
    }

    if (
      errors.password === undefined &&
      errors.username === undefined &&
      username.length !== 0 &&
      password.length !== 0
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    const timeoutId = setTimeout(() => setErrors(errors), 500);
    return () => clearTimeout(timeoutId);
  };

  useEffect(validateForm, [username, password]);

  return (
    <div className="h-[100vh] bg-gray-100">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <h1 className="text-[32px] font-semibold mb-5">
          Registrasi User Karyawan Apotek
        </h1>
        <div className="flex flex-col justify-center items-center w-[400px] mb-5 p-10 rounded-xl bg-white border border-gray-400">
          <form action={formAction} className="w-full">
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm mb-1">
                Username
              </label>
              <input
                required
                type="text"
                name="username"
                className="w-full h-8 p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              {errors.username && (
                <span className="text-red-400 text-sm">{errors.username}</span>
              )}
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm mb-1">
                Password
              </label>
              <input
                required
                type="password"
                name="password"
                className="w-full h-8 p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">{errors.password}</span>
              )}
            </div>
            <SubmitButton valid={isValid} />
            {state && (
              <span className="mt-3 text-red-400 text-center block text-sm">
                {state}
              </span>
            )}
          </form>
        </div>
        <h1 className="text-md font-semibold mb-5">Open Apotek v0.1</h1>
      </div>
    </div>
  );
}

function SubmitButton({ valid }: { valid: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = () => {
    return !valid;
  };

  return (
    <div>
      {isDisabled() ? (
        <button
          type="submit"
          className="text-center bg-gray-400 text-white p-2 w-full rounded-md"
          disabled
        >
          Daftar
        </button>
      ) : (
        <button
          type="submit"
          className="text-center bg-black text-white p-2 w-full rounded-md"
        >
          {pending ? "Mendaftar..." : "Daftar"}
        </button>
      )}
    </div>
  );
}
