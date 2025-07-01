import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import BookingsPage from "./BookingsPage";

export default function BookingsProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <BookingsPage />
      </AdminLayout>
    </AdminGuard>
  );
}
