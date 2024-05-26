import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [commentPost, setCommentPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      }

      if (res.ok) {
        setComment("");
        setCommentPost([data, ...commentPost]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPostComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-post-comments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setCommentPost(data);
        }
        if (!res.ok) {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getPostComments();
  }, [postId]);

  //like comment func
  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const res = await fetch(`/api/comment/like-comment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setCommentPost(
          commentPost.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setCommentPost(
      commentPost.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  //Delete
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      } else {
        setCommentPost(
          commentPost.filter((comment) => comment._id !== commentId)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl w-full p-3">
      {error && <Alert color={"failure"}>{error} </Alert>}
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            src={currentUser?.profilePicture}
            alt=""
            className="rounded-full h-5 w-5 object-cover"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              disabled={loading ? true : false}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      )}

      <div className="text-sm my-5 flex items-center gap-1">
        <p>Comments:</p>
        <div className="border border-gray-400 py-[2px] px-2 rounded-sm">
          <p>{commentPost.length}</p>
        </div>
      </div>
      <div>
        {commentPost &&
          commentPost?.length > 0 &&
          commentPost?.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
      </div>

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
              Are you sure you want to delete your comment
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={() => handleDeleteComment(commentToDelete)}
              >
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
