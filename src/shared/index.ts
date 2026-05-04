// ── Types ──────────────────────────────────────────────────────────────────────
export type { UserRole, AuthMembership, AuthUser } from "@/shared/types/user.types";

// ── Hooks ──────────────────────────────────────────────────────────────────────
export { useAuth } from "@/shared/hooks/use-auth.hook";
export { useIsMobile } from "@/shared/hooks/use-mobile.hook";
export { useScrollDirection } from "@/shared/hooks/use-scroll-direction.hook";
export { useFinancialModal, FinancialModalProvider } from "@/shared/hooks/financial-modal.context";

// ── Utils ─────────────────────────────────────────────────────────────────────
export { formatMoney, formatSqm, formatPhone, parseRawNumber, parseRawDecimal } from "@/shared/utils/format-input.utils";

// ── Actions ────────────────────────────────────────────────────────────────────
export { logoutAction } from "@/shared/actions/logout.actions";
export { getCitiesAction } from "@/shared/actions/get-cities.actions";
export { getFinancialProfileAction, saveFinancialProfileAction } from "@/shared/actions/save-financial-profile.actions";
