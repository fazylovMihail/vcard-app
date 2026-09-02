import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "./queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";

import "./assets/styles/style.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. HTML is missing #root.");
}

createRoot(rootElement).render(
  <>
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <RouterProvider router={router} />
          </HelmetProvider>
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  </>
);
