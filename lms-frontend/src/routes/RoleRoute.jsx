import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

const RoleRoute = ({ children, allowed }) => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (!allowed.includes(role)) return <Navigate to="/" />;

  return children;
};

export default RoleRoute;
