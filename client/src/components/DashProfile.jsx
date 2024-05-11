import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const defaultValue = {
    username: currentUser.username,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture,
    old_password: "",
    new_password: "",
    new_password_2: "",
  };

  let getPass;
  const [formData, setFormData] = useState(defaultValue);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [hideInputPassword, setHideInputPassword] = useState(true);
  const filePickerRef = useRef();
  console.log(formData);

  useEffect(() => {
    const HPassword = async () => {
      const res = await fetch(`/api/user/getUser/${currentUser._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      getPass = data;
    };
    HPassword();
  }, []);

  const handleOnchangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      console.log("failure");
    }
  };
  // console.log(formData);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          });
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer
        shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || formData?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover
             border-8 border-[lightgray] ${
               imageFileUploadProgress &&
               imageFileUploadProgress < 100 &&
               "opacity-60"
             }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError} </Alert>
        )}
        <TextInput
          id="username"
          type="text"
          defaultValue={formData?.username}
          onChange={handleOnchangeInput}
        />
        <TextInput
          id="email"
          type="email"
          defaultValue={formData?.email}
          onChange={handleOnchangeInput}
        />
        <span
          className="text-sm"
          onClick={() =>
            setHideInputPassword((hideInputPassword) => !hideInputPassword)
          }
        >
          Confirm password
        </span>
        {!hideInputPassword && (
          <>
            <TextInput
              id="old_password"
              type="password"
              defaultValue={
                formData?.old_password.length > 10
                  ? formData.old_password.substring(0, 10)
                  : formData.old_password
              }
              onChange={handleOnchangeInput}
            />
            <TextInput
              id="new_password"
              type="password"
              defaultValue={formData?.new_password}
              onChange={handleOnchangeInput}
              placeholder="New Password"
            />
            <TextInput
              id="new_password_2"
              type="password"
              defaultValue={formData?.new_password_2}
              onChange={handleOnchangeInput}
              placeholder="Confirm Password"
            />
          </>
        )}
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
