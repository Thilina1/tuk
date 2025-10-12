import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import Settings from "./SettingsPage";
import ManageUsers from "./userSettings";

export default function TuktukProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Settings />
        <ManageUsers/>
      </AdminLayout>
    </AdminGuard>
  );
}
