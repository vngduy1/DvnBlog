import { Alert, Button, Textarea } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  //edit
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  //get User
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

  //Edit
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className="border-b dark:border-gray-600 text-sm 
      flex gap-2 py-2"
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
          <span className="font-bold mr-1 text-xs truncate">
            @{user?.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}{" "}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="p-2 w-full text-gray-700 bg-gray-200 rounded-md 
            resize-none focus:outline-none focus:bg-gray-100"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end mt-2 text-xs">
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div
              className="flex gap-2 items-center pt-2 text-xs border-t 
          dark:border-gray-700 max-w-fit"
            >
              <button
                type="button"
                onClick={() => {
                  onLike(comment._id);
                }}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0
                  ? comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")
                  : "like"}
              </p>

              {/* action  */}
              {currentUser &&
                (currentUser._id === comment.UserId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-600 hover:text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
