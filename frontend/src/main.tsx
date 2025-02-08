import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  console.log(error);
  return (
    <div
      role="alert"
      className="h-dvh w-dvw flex justify-center align-center flex-col gap-4"
    >
      <h3 className="text-3xl mx-auto">Something went wrong</h3>
      <pre className="text-xl text-red-500 mx-auto">Error: {error.message}</pre>
      <button onClick={resetErrorBoundary} className="btn btn-outline mx-auto">
        Try again
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={(details) => {
        console.log(details);
      }}
    >
      <SnackbarProvider autoHideDuration={2000}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  </StrictMode>
);
