import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import Settings from "./MasterPricesPage";

export default function TuktukProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Settings />
      </AdminLayout>
    </AdminGuard>
  );
}
