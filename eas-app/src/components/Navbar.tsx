import { useAuth } from "../context/AuthContent";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user,setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);        // clear user from context
    navigate("/login");   // redirect to login page
  };
  if (!user) return null; // no navbar if not logged in

  return (
    <nav className="flex justify-between items-center bg-gray-200 p-4">
      <div className="font-bold">Employee Attendance System</div>
      <div className="flex items-center gap-4">
        <span>{user.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};