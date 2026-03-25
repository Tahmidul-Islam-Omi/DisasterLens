import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./i18n/LanguageContext";
import { RoleProvider } from "./context/RoleContext";

export default function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <RouterProvider router={router} />
      </RoleProvider>
    </LanguageProvider>
  );
}