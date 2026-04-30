import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgentPropertyLeadsAction } from "@/myAccount/agent/actions/get-agent-property-leads.actions";
import type { AgentLead } from "@/myAccount/agent/types/agent.types";

export const useAgentPropertyLeads = (
  propertyId: number | undefined,
  enabled: boolean
) => {
  const [localLeadUpdates, setLocalLeadUpdates] = useState<Record<number, number>>({});

  const leadsQuery = useQuery({
    queryKey: ["agent-property-leads", propertyId],
    queryFn: () => getAgentPropertyLeadsAction(propertyId!),
    enabled: !!propertyId && enabled,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const leads: AgentLead[] = (leadsQuery.data ?? []).map((lead) =>
    localLeadUpdates[lead.id] !== undefined
      ? { ...lead, stage: localLeadUpdates[lead.id] }
      : lead
  );

  const handleLeadStageUpdate = (leadId: number, newStage: number) => {
    setLocalLeadUpdates((prev) => ({ ...prev, [leadId]: newStage }));
  };

  return {
    leads,
    leadsLoading: leadsQuery.isLoading,
    refetchLeads: leadsQuery.refetch,
    handleLeadStageUpdate,
  };
};
