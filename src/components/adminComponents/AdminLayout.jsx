// import AdminNavbar from "./AdminNavbar"
// import AdminSidebar from "./AdminSidebar"

// const AdminLayout = () => {
//   return (
//     <div>
//       <AdminNavbar/>
//       <AdminSidebar/>
//     </div>
//   )
// }

// export default AdminLayoutimport AdminNavbar from "./AdminNavbar";
import AdminNavbar from "./layout/AdminNavbar.jsx";
import AdminSidebar from "./layout/AdminSidebar.jsx";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto p-8 bg-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

