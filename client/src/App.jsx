import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Header from "./components/Header";
import FooterComponent from "./components/FooterComponent";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivate from "./components/OnlyAdminPrivate";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./components/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import CurrentUser from "./components/CurrentUser";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<CurrentUser />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivate />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Project />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <FooterComponent />
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
