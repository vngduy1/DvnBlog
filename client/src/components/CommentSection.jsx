import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentPost, setCommentPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.log(res);

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
          commentPost.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
      </div>
    </div>
  );
}
