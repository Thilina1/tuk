import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import Locations from "./LocationsPage";

export default function DashboardProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Locations />
      </AdminLayout>
    </AdminGuard>
  );
}
