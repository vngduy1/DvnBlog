import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const defaultValue = {
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
    if (!formData.email) {
      return dispatch(signInFailure("Email cannot be left blank!!"));
    }

    if (!formData.password) {
      return dispatch(signInFailure("Password cannot be left blank!!"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
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
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? {"  "}</span>

            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up
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
