import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import TuktukPage from "./TuktukPage";

export default function TuktukProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <TuktukPage />
      </AdminLayout>
    </AdminGuard>
  );
}
