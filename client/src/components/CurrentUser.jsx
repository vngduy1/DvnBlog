import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function CurrentUser() {
  const { currentUser } = useSelector((state) => state.user);
  return !currentUser ? <Outlet /> : <Navigate to={"/"} />;
}
