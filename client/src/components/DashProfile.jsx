import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const defaultValue = {
    username: currentUser.username,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture,
  };

  const [input, setInput] = useState(defaultValue);

  const handleOnchangeInput = (e) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.username || !input.email || !input.password) {
      console.log("failure");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div
          className="w-32 h-32 self-center cursor-pointer
        shadow-md overflow-hidden rounded-full"
        >
          <img
            src={input?.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover
             border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          id="username"
          type="text"
          defaultValue={input?.username}
          onChange={handleOnchangeInput}
        />
        <TextInput
          id="email"
          type="email"
          defaultValue={input?.email}
          onChange={handleOnchangeInput}
        />
        <TextInput id="password" type="password" defaultValue={"********"} />
        <Button
          type="submit"
          className="sm:w-full"
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
