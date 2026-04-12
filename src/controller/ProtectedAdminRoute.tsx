import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { ContextObj } from "../store/Context";

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, loginStatus, auth } = useContext(ContextObj);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loginStatus) {
    return <Navigate to="/" replace />;
  }

  if (auth.role !== 0) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
