import { Alert } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";

export default function Comment({ comment }) {
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
          return;
        }

        if (res.ok) {
          setUser(data);
        }
      } catch (e) {
        setError(e.message);
      }
    };

    getUser();
  }, [comment]);

  return (
    <div
      className="border-b dark:border-gray-600 text-sm 
      flex gap-2"
    >
      {error && <Alert color={"failure"}>{error} </Alert>}
      <div className="flex-shrink-0 mr-3">
        <img
          className="h-10 w-10 object-cover rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-sx truncate">
            @{user?.username}
          </span>
          <span>{moment(comment?.createdAt).fromNow()} </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex gap-2 items-center">
          <p>{comment?.likes.length} likes </p>
          <p className="text-sm">Edit</p>
          <p className="text-sm">Delete</p>
        </div>
      </div>
    </div>
  );
}
