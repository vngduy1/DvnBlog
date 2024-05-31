import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Spinner, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const defaultSidebar = {
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  };
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState(defaultSidebar);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFormUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFormUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
        }
        if (res.ok) {
          setPosts(data.posts);
          setShowMore(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      setLoading(true);
      const res = await fetch(`/api/post/get-posts?${searchQuery}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }
      if (res.ok) {
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts?.length === 1 ? true : false);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className="p-7 border-b md:border-r md:min-h-screen 
      border-gray-500"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap">
              Search Term:
            </label>
            <TextInput
              placeholder="search"
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">
              Sort:
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort || "desc"}
              id="sort"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="whitespace-nowrap">
              Category :
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category || "uncategorized"}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">ReactJs</option>
              <option value="nextjs">NextJs</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone={"purpleToPink"}>
            Apply Filter
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h1
          className="text-3xl font-semibold sm:border-b 
        border-gray-500 p-3 mt-5"
        >
          Posts results
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {error && <Alert color={"failure"}>{error} </Alert>}
          {loading && (
            <div className="flex flex-wrap items-center gap-2">
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </div>
          )}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts</p>
          )}

          {!loading &&
            posts &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}

          {showMore && (
            <button
              className="text-teal-500 text-lg hover:underline 
              p-7 w-full"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
