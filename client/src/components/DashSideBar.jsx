import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";

export default function DashSideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* profile  */}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile" ? true : false}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {/* posts  */}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"} as="button">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          {/* action  */}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer hidden md:flex "
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
