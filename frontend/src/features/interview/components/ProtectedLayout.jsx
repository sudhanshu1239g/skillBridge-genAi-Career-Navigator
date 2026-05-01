import React from "react";
import { Outlet } from "react-router";
import TopNavbar from "./TopNavbar";

const ProtectedLayout = () => {
    return (
        <>
            <TopNavbar />
            <Outlet />
        </>
    );
};

export default ProtectedLayout;
