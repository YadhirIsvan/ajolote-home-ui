import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[GlobalErrorBoundary] Error no controlado:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4 text-center">
          <div className="flex flex-col items-center gap-3 max-w-md">
            <span className="text-5xl">⚠️</span>
            <h1 className="text-2xl font-semibold text-midnight">
              Algo salió mal
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ocurrió un error inesperado. Puedes intentar recargar la página.
              Si el problema persiste, contacta a soporte.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-2 w-full overflow-auto rounded-md bg-muted p-3 text-left text-xs text-destructive">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-[hsl(var(--champagne-gold))] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Recargar página
          </button>
          <button
            onClick={this.handleReset}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Intentar continuar sin recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
