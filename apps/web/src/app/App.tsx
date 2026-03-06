import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "@/app/router";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme } = useTheme();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" theme={theme} />
    </>
  );
}
