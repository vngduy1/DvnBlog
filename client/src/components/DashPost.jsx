import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  // loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //get post
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data.posts);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
      if (!res.ok) {
        setError(data.message);
        return;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setError(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentUser._id]);

  //show more func
  const handleShowMore = async () => {
    setError(null);
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(error);
      }

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  //delete func
  const handleDeletePost = async (e) => {
    setShowModal(false);

    try {
      const res = await fetch(
        `/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        await fetchPosts();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div
      className=" overflow-x-scroll p-3
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
    >
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md table-auto whitespace-nowrap">
            {/* table head  */}
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {/* table body  */}
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}{" "}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-800 dark:text-white"
                    >
                      {post.title}
                    </Link>{" "}
                  </Table.Cell>
                  <Table.Cell className="text-gray-600 dark:text-white">
                    {post.category}{" "}
                  </Table.Cell>

                  {/* table action */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline cursor-pointer"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7 hover:underline"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <span className="text-3xl text-center">
          There are currently no posts available
        </span>
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
              Are you sure you want to delete this post
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeletePost}>
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
