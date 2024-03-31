"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import { useEffect, useState } from "react";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <div>
      <button
        type="submit"
        className="text-center bg-black text-white p-2 w-full rounded-md"
        disabled={pending}
      >
        Masuk
      </button>
      {pending && <h1 className="text-md font-semibold mb-5">Loading...</h1>}
    </div>
  );
}

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  type errors = { username: string; password: string };
  const [state, formAction] = useFormState(login, null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({} as errors);

  const validateForm = () => {
    let errors: errors = {} as errors;

    if (username.length >= 1 && username.length < 4) {
      errors.username = "Username must contain more than 3 letters";
    }

    setErrors(errors);
  };

  useEffect(validateForm, [username, password]);

  return (
    <div className="h-[100vh] bg-gray-100">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <h1 className="text-[32px] font-semibold mb-5">Selamat datang</h1>
        {searchParams.register === "success" && (
          <div className="w-[400px] mb-5 p-4 rounded-xl bg-green-100 border border-green-300">
            <span className='text-sm'>Register success. Silahkan login.</span>
          </div>
        )}
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
                  setTimeout(() => {
                    setUsername(e.target.value);
                  }, 1500);
                }}
              />
              {errors.username && (
                <span className="text-red-400">{errors.username}</span>
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
              />
            </div>
            <Submit />
          </form>
        </div>
        <h1 className="text-md font-semibold mb-5">Open Apotek v0.1</h1>
        {state && <h1 className="text-md font-semibold mb-5">{state}</h1>}
      </div>
    </div>
  );
}
