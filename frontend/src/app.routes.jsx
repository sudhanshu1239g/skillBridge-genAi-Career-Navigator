import {createBrowserRouter} from 'react-router';
import Register from './features/auth/pages/register';
import Login from './features/auth/pages/login';
import Protected from './features/auth/components/Protected';

export const router=createBrowserRouter([
    {
        path:'/register',
        element:<Register/>
    },
    {   path:'/login',
        element:<Login/>
    },
    {
        path:'/',
        element: <Protected><h1>Home</h1></Protected>
    }
])


