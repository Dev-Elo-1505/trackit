import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthContextProvider>
     <RouterProvider router={router} />
     <Toaster richColors position="top-right" />
    </AuthContextProvider>
  );
}

export default App;
