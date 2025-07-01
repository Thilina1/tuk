import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import DashboardPage from "./DashboardPage";

export default function DashboardProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <DashboardPage />
      </AdminLayout>
    </AdminGuard>
  );
}
