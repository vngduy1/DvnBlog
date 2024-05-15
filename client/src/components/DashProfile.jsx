import { Alert, Button, Modal, TextInput } from "flowbite-react";
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);
  const defaultValue = {
    username: currentUser.username,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture,
    old_password: "",
    new_password: "",
    new_password_2: "",
  };
  // formData
  const [formData, setFormData] = useState(defaultValue);
  const [hideInputPassword, setHideInputPassword] = useState(true);
  //image
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  //thông báo
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  //Modal
  const [showModal, setShowModal] = useState(false);
  //Get Password
  useEffect(() => {
    const HPassword = async () => {
      const res = await fetch(`/api/user/getUser/${currentUser._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setFormData({ ...formData, old_password: data });
    };
    HPassword();
  }, []);

  //Change input
  const handleOnchangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //Submit func
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (imageFileUploading) {
      return;
    }
    if (!formData.username) {
      return dispatch(updateFailure("Username cannot be left blank!!"));
    }
    if (!formData.email) {
      return dispatch(updateFailure("Email cannot be left blank!!"));
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile uploaded successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  //change Image
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
    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          });
          setImageFileUploading(false);
        });
      }
    );
  };

  //delete func
  const handleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "applications/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        setShowModal(false);
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  //sign out func
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });
      if (!res.ok) {
        dispatch(signOutFailure(data.message));
      }
      {
        const data = await res.json();
        dispatch(signOutSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* form */}
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
              placeholder="Old Password"
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

      {/* action */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      {/* alert */}
      {updateUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateUserSuccess}{" "}
        </Alert>
      )}
      {updateUserError && (
        <Alert color={"failure"} className="mt-5">
          {updateUserError}{" "}
        </Alert>
      )}

      {/* modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14
           text-gray-400 dark:text-gray-200 mb-4 mx-auto"
            />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>

            {error && (
              <Alert color={"failure"} className="mt-5">
                {error}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
