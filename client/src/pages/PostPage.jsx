import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts/?slug=${postSlug}`);

        const data = await res.json();

        if (res.ok) {
          setPost(data.posts[0]);
        } else {
          setError(data.message);
          return;
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/get-posts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {error && <Alert color={"failure"}>{error} </Alert>}
      PostPage
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post?.title}
      </h1>
      <Link
        to={`/search?category=${post && post?.category}`}
        className="self-center mx-auto mt-5"
      >
        <Button color={"gray"} pill size={"xs"}>
          {post && post?.category}{" "}
        </Button>{" "}
      </Link>
      <img
        src={post && post?.image}
        alt={post && post?.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div
        className="p-3 flex justify-between border-b border-slate-300
      mx-auto w-full max-w-2xl text-xs"
      >
        <span>{post && new Date(post.createdAt).toLocaleDateString()} </span>
        <span>
          {post && (post?.content.length / 1000).toFixed(2)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post?.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post?._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5 ">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts?.map((recentPost) => (
              <PostCard key={recentPost._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
}
