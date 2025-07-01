import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import Persons from "./PersonsPage";

export default function DashboardProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Persons />
      </AdminLayout>
    </AdminGuard>
  );
}
