import { RouterProvider } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import { router } from "./routes";

export default function App() {
  return (
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>
  );
}
