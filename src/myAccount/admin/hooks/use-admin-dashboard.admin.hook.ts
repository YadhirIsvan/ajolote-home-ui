import { useState } from "react";
import type { AdminTab } from "@/myAccount/admin/types/admin.types";

export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("propiedades");

  return { activeTab, setActiveTab };
};
