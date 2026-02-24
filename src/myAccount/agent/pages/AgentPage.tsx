import AgentDashboard from "@/myAccount/agent/components/AgentDashboard";

interface AgentPageProps {
  onLogout: () => void;
}

const AgentPage = ({ onLogout }: AgentPageProps) => {
  return <AgentDashboard onLogout={onLogout} />;
};

export default AgentPage;
