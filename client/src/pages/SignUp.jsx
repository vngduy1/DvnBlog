import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Label,
  Popover,
  Spinner,
  TextInput,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Oauth from "../components/Oauth";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const defaultValue = {
    username: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(defaultValue);
  const [showPassword, setShowPassword] = useState(false);

  const handleOnchangeInput = (id, value) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields!!!"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.error));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        setFormData(defaultValue);
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div
        className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row 
      md:items-center gap-5"
      >
        {/* left */}
        <div className="flex-1">
          <div className="text-4xl font-bold dark:text-white">
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white"
            >
              DVN
            </span>
            Blog
          </div>
          <p className="text-sm mt-5">
            This is a demo project. <br /> You can sign up with your email and
            password <br />
            or with <span className="underline">Google</span>
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="mb-2">
                UserName
              </Label>
              <TextInput
                type="text"
                id="username"
                disabled={loading ? true : false}
                required
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  handleOnchangeInput("username", e.target.value.trimStart())
                }
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email address
              </Label>
              <TextInput
                type="email"
                id="email"
                placeholder="email@gmail.com"
                value={formData.email}
                disabled={loading ? true : false}
                required
                onChange={(e) => handleOnchangeInput("email", e.target.value)}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Popover
                trigger="hover"
                content={
                  <div className="space-y-2 p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Must have at least 6 characters
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                      <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                    <p>It’s better to have:</p>
                    <ul>
                      <li className="mb-1 flex items-center">
                        <svg
                          className="me-2 h-3.5 w-3.5 text-green-400 dark:text-green-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 12"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                        Upper & lower case letters
                      </li>
                      <li className="mb-1 flex items-center">
                        <svg
                          className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        A symbol (#$&)
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="me-2.5 h-3 w-3 text-gray-300 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        A longer password (min. 12 chars.)
                      </li>
                    </ul>
                  </div>
                }
              >
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  required
                  placeholder="ABC@abc123"
                  disabled={loading ? true : false}
                  onChange={(e) =>
                    handleOnchangeInput("password", e.target.value.trim())
                  }
                />
              </Popover>
              <span
                className="absolute right-2 top-[56%]"
                onClick={() => {
                  setShowPassword((showPassword) => !showPassword);
                }}
              >
                {formData.password.length > 0 ? (
                  showPassword ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )
                ) : (
                  ""
                )}
              </span>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              className="uppercase"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />{" "}
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? {"  "}</span>

            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
