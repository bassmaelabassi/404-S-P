import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") return <div>You are not authorized to enter.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">  Administrator Control Panel</h1>
      <p>Hello {user.username} 👑</p>
    </div>
  );
};

export default Admin;