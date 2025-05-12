import { useState, useEffect } from "react";
import laboratorioService from "../../services/LaboratorioService";
import ordenCompraService from "../../services/OrdencompraService";
import Layout from "../../../shared/layout/Layout";

const UserPage = () => {
  // Estados para laboratorios
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratorioSearch, setLaboratorioSearch] = useState("");
  const [filteredLaboratorios, setFilteredLaboratorios] = useState([]);

  // Estados para órdenes de compra
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [ordenSearch, setOrdenSearch] = useState("");
  const [filteredOrdenesCompra, setFilteredOrdenesCompra] = useState([]);

  // Estado para manejar pestañas
  const [activeTab, setActiveTab] = useState("laboratorios");

  // Cargar datos iniciales
  useEffect(() => {
    fetchLaboratorios();
    fetchOrdenesCompra();
  }, []);

  // Filtrar laboratorios cuando cambia la búsqueda
  useEffect(() => {
    const filtered = laboratorios.filter((lab) => 
      (lab.razonSocial?.toLowerCase() || "").includes(laboratorioSearch.toLowerCase()) ||
      String(lab.CodLab || "").includes(laboratorioSearch) ||
      (lab.email?.toLowerCase() || "").includes(laboratorioSearch.toLowerCase())
    );
    setFilteredLaboratorios(filtered);
  }, [laboratorioSearch, laboratorios]);

  // Filtrar órdenes de compra cuando cambia la búsqueda
  useEffect(() => {
    const filtered = ordenesCompra.filter((orden) => 
      String(orden.NroOrdenC || "").includes(ordenSearch) ||
      (orden.Situacion?.toLowerCase() || "").includes(ordenSearch.toLowerCase()) ||
      String(orden.CodLab || "").includes(ordenSearch) ||
      (orden.Laboratorio?.razonSocial?.toLowerCase() || "").includes(ordenSearch.toLowerCase())
    );
    setFilteredOrdenesCompra(filtered);
  }, [ordenSearch, ordenesCompra])

  // Funciones para laboratorios
  const fetchLaboratorios = async () => {
    try {
      const response = await laboratorioService.getAll();
      setLaboratorios(response.data);
      setFilteredLaboratorios(response.data);
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
      alert("Error al cargar los laboratorios");
    }
  };

  // Funciones para órdenes de compra
  const fetchOrdenesCompra = async () => {
    try {
      const response = await ordenCompraService.getAll();
      setOrdenesCompra(response.data);
      setFilteredOrdenesCompra(response.data);
    } catch (error) {
      console.error("Error al cargar órdenes de compra:", error);
      alert("Error al cargar las órdenes de compra");
    }
  };

  const handleLabSearchChange = (e) => {
    setLaboratorioSearch(e.target.value);
  };

  const handleOrdenSearchChange = (e) => {
    setOrdenSearch(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>

        <div className="flex mb-4">
          <button
            className={`mr-2 px-4 py-2 ${
              activeTab === "laboratorios"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("laboratorios")}
          >
            Laboratorios
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "ordenesCompra"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("ordenesCompra")}
          >
            Órdenes de Compra
          </button>
        </div>

        {activeTab === "laboratorios" && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Lista de Laboratorios</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por código, razón social o email..."
                  value={laboratorioSearch}
                  onChange={handleLabSearchChange}
                  className="w-full p-2 border rounded pl-10"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Código</th>
                    <th className="py-2 px-4 border-b">Razón Social</th>
                    <th className="py-2 px-4 border-b">Dirección</th>
                    <th className="py-2 px-4 border-b">Teléfono</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaboratorios.length > 0 ? (
                    filteredLaboratorios.map((lab) => (
                      <tr key={lab.id}>
                        <td className="py-2 px-4 border-b">{lab.CodLab}</td>
                        <td className="py-2 px-4 border-b">{lab.razonSocial}</td>
                        <td className="py-2 px-4 border-b">{lab.direccion}</td>
                        <td className="py-2 px-4 border-b">{lab.telefono}</td>
                        <td className="py-2 px-4 border-b">{lab.email}</td>
                        <td className="py-2 px-4 border-b">{lab.contacto}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No se encontraron laboratorios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ordenesCompra" && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Lista de Órdenes de Compra</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por número, situación o laboratorio..."
                  value={ordenSearch}
                  onChange={handleOrdenSearchChange}
                  className="w-full p-2 border rounded pl-10"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nro. Orden</th>
                    <th className="py-2 px-4 border-b">Fecha Emisión</th>
                    <th className="py-2 px-4 border-b">Situación</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Laboratorio</th>
                    <th className="py-2 px-4 border-b">Nro. Factura</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdenesCompra.length > 0 ? (
                    filteredOrdenesCompra.map((orden) => (
                      <tr key={orden.id}>
                        <td className="py-2 px-4 border-b">{orden.NroOrdenC}</td>
                        <td className="py-2 px-4 border-b">
                          {orden.fechaEmision}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              orden.Situacion === "Pendiente"
                                ? "bg-yellow-500"
                                : orden.Situacion === "Aprobada"
                                ? "bg-green-500"
                                : orden.Situacion === "Rechazada"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {orden.Situacion}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">${orden.Total}</td>
                        <td className="py-2 px-4 border-b">
                          {orden.Laboratorio
                            ? orden.Laboratorio.razonSocial
                            : orden.CodLab}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {orden.NrofacturaProv}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No se encontraron órdenes de compra
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserPage;