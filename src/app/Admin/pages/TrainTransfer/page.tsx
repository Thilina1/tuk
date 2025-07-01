import AdminGuard from "../../components/AdminGuard";
import AdminLayout from "../../components/AdminLayout";
import TrainTransfer from "./TrainTransferPage";

export default function DashboardProtectedPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <TrainTransfer />
      </AdminLayout>
    </AdminGuard>
  );
}
