import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import Discount from "./DiscountPage";

export default function DiscountPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Discount />
      </AdminLayout>
    </AdminGuard>
  );
}
