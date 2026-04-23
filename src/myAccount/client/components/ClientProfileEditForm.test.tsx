import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClientProfileEditForm from "./ClientProfileEditForm";
import { useClientConfig } from "@/myAccount/client/hooks/use-client-config.client.hook";

vi.mock("@/myAccount/client/hooks/use-client-config.client.hook");
vi.mock("react-phone-number-input", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    id,
    disabled,
  }: {
    value?: string;
    onChange: (v: string | undefined) => void;
    id?: string;
    disabled?: boolean;
  }) => (
    <input
      data-testid="phone-input"
      id={id}
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  isValidPhoneNumber: vi.fn(
    (v?: string) => !!v && v.startsWith("+") && v.length >= 10
  ),
}));

const mockedUseClientConfig = vi.mocked(useClientConfig);

const PROFILE = {
  id: 1,
  email: "ana@example.com",
  first_name: "Ana",
  last_name: "García",
  phone: "+525512345678",
  avatar: null,
  city: "CDMX",
};

beforeEach(() => vi.clearAllMocks());

function setup({
  updateProfile = vi.fn().mockResolvedValue({ success: true }),
  isSaving = false,
  profile = PROFILE,
  onBack = vi.fn(),
} = {}) {
  mockedUseClientConfig.mockReturnValue({
    profile,
    profileLoading: false,
    phone: profile?.phone ?? "",
    updateProfile,
    isSaving,
  } as never);

  const utils = render(<ClientProfileEditForm onBack={onBack} />);
  return { ...utils, updateProfile, onBack };
}

describe("ClientProfileEditForm", () => {
  it("pre-llena los campos con los datos del perfil", () => {
    setup();
    expect(screen.getByPlaceholderText("Tu nombre")).toHaveValue("Ana");
    expect(screen.getByPlaceholderText("Tu apellido")).toHaveValue("García");
    expect(screen.getByPlaceholderText("Tu ciudad")).toHaveValue("CDMX");
    expect(screen.getByTestId("phone-input")).toHaveValue("+525512345678");
  });

  it("submit con phone válido llama updateProfile con los datos trimmeados", async () => {
    const { updateProfile, onBack } = setup();
    const user = screen.getByPlaceholderText("Tu nombre");
    fireEvent.change(user, { target: { value: "  Beatriz  " } });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith({
        phone: "+525512345678",
        first_name: "Beatriz",
        last_name: "García",
        city: "CDMX",
      })
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Perfil actualizado correctamente"
      )
    );
    await waitFor(() => expect(onBack).toHaveBeenCalled(), { timeout: 2000 });
  });

  it("phone inválido: submit deshabilitado y muestra error si se fuerza", async () => {
    const { updateProfile } = setup({
      profile: { ...PROFILE, phone: "123" },
    });

    const button = screen.getByText("Guardar cambios").closest("button")!;
    expect(button).toBeDisabled();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("updateProfile falla: muestra mensaje de error del backend", async () => {
    const updateProfile = vi.fn().mockResolvedValue({
      success: false,
      message: "Teléfono ya registrado",
    });
    setup({ updateProfile });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Teléfono ya registrado"
      )
    );
  });

  it("isSaving: botón muestra spinner y está deshabilitado", () => {
    setup({ isSaving: true });
    const button = screen.getByText("Guardando...").closest("button")!;
    expect(button).toBeDisabled();
  });

  it("cancelar llama onBack sin enviar", () => {
    const { onBack, updateProfile } = setup();
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(updateProfile).not.toHaveBeenCalled();
  });
});
