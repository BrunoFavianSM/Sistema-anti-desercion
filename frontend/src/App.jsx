import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import LayoutGeneral from "./componentes/LayoutGeneral.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Login from "./paginas/Login.jsx";
import PaginaNoEncontrada from "./paginas/PaginaNoEncontrada.jsx";
import ListaUsuarios from "./paginas/Usuarios/ListaUsuarios.jsx";
import FormularioUsuario from "./paginas/Usuarios/FormularioUsuario.jsx";
import PerfilUsuario from "./paginas/Usuarios/PerfilUsuario.jsx";
import ListaTalleres from "./paginas/Talleres/ListaTalleres.jsx";
import FormularioTaller from "./paginas/Talleres/FormularioTaller.jsx";
import DetalleTaller from "./paginas/Talleres/DetalleTaller.jsx";
import ListaConsultas from "./paginas/Consultas/ListaConsultas.jsx";
import FormularioConsulta from "./paginas/Consultas/FormularioConsulta.jsx";
import CargaETL from "./paginas/ETL/CargaETL.jsx";
import PanelML from "./paginas/ML/PanelML.jsx";
import PanelAlertas from "./paginas/Alertas/PanelAlertas.jsx";
import ListaAnaliticaTalleres from "./paginas/AnaliticaTalleres/ListaAnaliticaTalleres.jsx";
import DetalleAnaliticaTaller from "./paginas/AnaliticaTalleres/DetalleAnaliticaTaller.jsx";
import { useAutenticacion } from "./estado/usoAutenticacion.js";

function RutasProtegidas({ children }) {
  const token = useAutenticacion((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "toaster-raiz",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RutasProtegidas>
              <LayoutGeneral />
            </RutasProtegidas>
          }
        >
          <Route index element={<Inicio />} />
          <Route path="usuarios" element={<ListaUsuarios />} />
          <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
          <Route path="usuarios/:uuid" element={<PerfilUsuario />} />
          <Route path="usuarios/:uuid/editar" element={<FormularioUsuario />} />
          <Route path="talleres" element={<ListaTalleres />} />
          <Route path="talleres/nuevo" element={<FormularioTaller />} />
          <Route path="talleres/:id" element={<DetalleTaller />} />
          <Route path="talleres/:id/editar" element={<FormularioTaller />} />
          <Route path="consultas" element={<ListaConsultas />} />
          <Route path="consultas/nueva" element={<FormularioConsulta />} />
          <Route path="etl" element={<CargaETL />} />
          <Route path="ml" element={<PanelML />} />
          <Route path="alertas" element={<PanelAlertas />} />
          <Route path="analitica-talleres" element={<ListaAnaliticaTalleres />} />
          <Route
            path="analitica-talleres/:id"
            element={<DetalleAnaliticaTaller />}
          />
        </Route>
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

