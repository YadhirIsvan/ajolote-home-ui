import MasterAdminDashboard from "@/myAccount/admin/components/MasterAdminDashboard";

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage = ({ onLogout }: AdminPageProps) => {
  return <MasterAdminDashboard onLogout={onLogout} />;
};

export default AdminPage;
