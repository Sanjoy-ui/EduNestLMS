import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword';
import getCurrentUser from './customHooks/getCurrentUser';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/admin/Dashboard';
import Courses from './pages/admin/Courses';
import AllCouses from './pages/AllCouses';
import AddCourses from './pages/admin/AddCourses';
import CreateCourse from './pages/admin/CreateCourse';
import CreateLecture from './pages/admin/CreateLecture';
import EditLecture from './pages/admin/EditLecture';
import getCouseData from './customHooks/getCouseData';
import ViewCourse from './pages/ViewCourse';
import ScrollToTop from './components/ScrollToTop';
import getCreatorCourseData from './customHooks/getCreatorCourseData';
import EnrolledCourse from './pages/EnrolledCourse';
import ViewLecture from './pages/ViewLecture';
import SearchWithAi from './pages/SearchWithAi';
import getAllReviews from './customHooks/getAllReviews';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { ClipLoader } from 'react-spinners';

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_API_GATEWAY_URL;
  // If running on an HTTPS site (e.g. Cloudflare Pages) and envUrl is HTTP or unset,
  // return empty string so requests are made relative to same-origin HTTPS domain
  // and handled by the Cloudflare Pages Function reverse proxy.
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    if (!envUrl || envUrl.startsWith('http://')) {
      return '';
    }
  }
  return envUrl || "http://localhost:8080";
};

export const serverUrl = getBackendUrl();

function App() {
  const { userData, loadingUser } = useSelector(state => state.user);

  getCurrentUser();
  getCouseData();
  getCreatorCourseData();
  getAllReviews();

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <ClipLoader size={35} color="black" />
        <p className="text-sm text-gray-500 font-medium">Loading session...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/allcourses' element={<AllCouses />} />
        <Route path='/viewcourse/:courseId' element={<ViewCourse />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to={"/signup"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/searchwithai' element={<SearchWithAi />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />

        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"} />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to={"/signup"} />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
