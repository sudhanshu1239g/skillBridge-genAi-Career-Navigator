import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import FullList from "./features/interview/pages/FullList";
import AboutUs from "./features/interview/pages/AboutUs";
import ProtectedLayout from "./features/interview/components/ProtectedLayout";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/full-list",
                element: <FullList />
            },
            {
                path: "/about-us",
                element: <AboutUs />
            },
            {
                path: "/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            }
        ]
    }
])
