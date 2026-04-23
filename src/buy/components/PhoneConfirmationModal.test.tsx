import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PhoneConfirmationModal from "./PhoneConfirmationModal";

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

const VALID_PHONE = "+525512345678";
const OTHER_VALID_PHONE = "+525599887766";

beforeEach(() => vi.clearAllMocks());

function setup(
  overrides: Partial<React.ComponentProps<typeof PhoneConfirmationModal>> = {}
) {
  const props: React.ComponentProps<typeof PhoneConfirmationModal> = {
    open: true,
    onOpenChange: vi.fn(),
    currentPhone: VALID_PHONE,
    isSubmitting: false,
    errorMessage: null,
    onConfirm: vi.fn(),
    ...overrides,
  };
  const utils = render(<PhoneConfirmationModal {...props} />);
  return { ...utils, props };
}

describe("PhoneConfirmationModal", () => {
  it("con phone existente: muestra número y botones de confirmación", () => {
    setup();
    expect(
      screen.getByText("¿A este número nos contactaremos?")
    ).toBeInTheDocument();
    expect(screen.getByText(VALID_PHONE)).toBeInTheDocument();
    expect(screen.getByText("Es correcto, agendar")).toBeInTheDocument();
    expect(screen.getByText("Actualizar número")).toBeInTheDocument();
  });

  it("sin phone: abre directo en modo edición con mensaje de requisito", () => {
    setup({ currentPhone: "" });
    expect(screen.getByText("Necesitamos tu teléfono")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Para agendar tu visita necesitamos un teléfono de contacto."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
  });

  it("'Es correcto, agendar' llama onConfirm con el phone actual", () => {
    const { props } = setup();
    fireEvent.click(screen.getByText("Es correcto, agendar"));
    expect(props.onConfirm).toHaveBeenCalledWith(VALID_PHONE);
  });

  it("'Actualizar número' cambia a modo edición mostrando input", () => {
    setup();
    fireEvent.click(screen.getByText("Actualizar número"));
    expect(screen.getByText("Actualiza tu teléfono")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toHaveValue(VALID_PHONE);
    expect(screen.getByText("Guardar y agendar")).toBeInTheDocument();
  });

  it("en edición: 'Guardar y agendar' deshabilitado con phone inválido", () => {
    setup({ currentPhone: "" });
    const button = screen.getByText("Guardar y agendar").closest("button")!;
    expect(button).toBeDisabled();
  });

  it("en edición: phone válido habilita botón y llama onConfirm con el nuevo phone", () => {
    const { props } = setup({ currentPhone: "" });
    const input = screen.getByTestId("phone-input");
    fireEvent.change(input, { target: { value: OTHER_VALID_PHONE } });
    const button = screen.getByText("Guardar y agendar").closest("button")!;
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(props.onConfirm).toHaveBeenCalledWith(OTHER_VALID_PHONE);
  });

  it("muestra errorMessage cuando se provee", () => {
    setup({ errorMessage: "Teléfono ya registrado" });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Teléfono ya registrado"
    );
  });

  it("isSubmitting: botón muestra 'Agendando...' y está deshabilitado", () => {
    setup({ isSubmitting: true });
    const button = screen.getByText("Agendando...").closest("button")!;
    expect(button).toBeDisabled();
  });

  it("con phone: botón 'Cancelar' en edición vuelve al modo confirmación", () => {
    setup();
    fireEvent.click(screen.getByText("Actualizar número"));
    expect(screen.getByText("Actualiza tu teléfono")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancelar"));
    expect(
      screen.getByText("¿A este número nos contactaremos?")
    ).toBeInTheDocument();
  });
});
