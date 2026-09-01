import { createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "./components/layouts";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <RouterLayout />,
  },
]);
