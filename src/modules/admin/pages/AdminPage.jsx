import { useState, useEffect } from "react";
import laboratorioService from "../../services/LaboratorioService";
import ordenCompraService from "../../services/OrdencompraService";
import Layout from "../../../shared/layout/Layout";

const AdminPage = () => {
  // Estados para laboratorios
  const [laboratorios, setLaboratorios] = useState([]);
  const [selectedLaboratorio, setSelectedLaboratorio] = useState(null);
  const [showLabForm, setShowLabForm] = useState(false);
  const [labFormData, setLabFormData] = useState({
    CodLab: "",
    razonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
    contacto: "",
  });

  // Estados para órdenes de compra
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showOrdenForm, setShowOrdenForm] = useState(false);
  const [ordenFormData, setOrdenFormData] = useState({
    NroOrdenC: "",
    fechaEmision: "",
    Situacion: "",
    Total: "",
    CodLab: "",
    NrofacturaProv: "",
  });

  // Estado para manejar pestañas
  const [activeTab, setActiveTab] = useState("laboratorios");

  // Cargar datos iniciales
  useEffect(() => {
    fetchLaboratorios();
    fetchOrdenesCompra();
  }, []);

  // Funciones para laboratorios
  const fetchLaboratorios = async () => {
    try {
      const response = await laboratorioService.getAll();
      setLaboratorios(response.data);
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
      alert("Error al cargar los laboratorios");
    }
  };

  const handleLabFormChange = (e) => {
    const { name, value } = e.target;
    setLabFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLaboratorio) {
        await laboratorioService.update(selectedLaboratorio.id, labFormData);
      } else {
        await laboratorioService.create(labFormData);
      }
      fetchLaboratorios();
      resetLabForm();
    } catch (error) {
      console.error("Error al guardar laboratorio:", error);
      alert("Error al guardar el laboratorio");
    }
  };

  const editLaboratorio = (lab) => {
    setSelectedLaboratorio(lab);
    setLabFormData({
      CodLab: lab.CodLab,
      razonSocial: lab.razonSocial,
      direccion: lab.direccion,
      telefono: lab.telefono,
      email: lab.email,
      contacto: lab.contacto,
    });
    setShowLabForm(true);
  };

  const deleteLaboratorio = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este laboratorio?")) {
      try {
        await laboratorioService.delete(id);
        fetchLaboratorios();
      } catch (error) {
        console.error("Error al eliminar laboratorio:", error);
        alert("Error al eliminar el laboratorio");
      }
    }
  };

  const resetLabForm = () => {
    setSelectedLaboratorio(null);
    setLabFormData({
      CodLab: "",
      razonSocial: "",
      direccion: "",
      telefono: "",
      email: "",
      contacto: "",
    });
    setShowLabForm(false);
  };

  // Funciones para órdenes de compra
  const fetchOrdenesCompra = async () => {
    try {
      const response = await ordenCompraService.getAll();
      setOrdenesCompra(response.data);
    } catch (error) {
      console.error("Error al cargar órdenes de compra:", error);
      alert("Error al cargar las órdenes de compra");
    }
  };

  const handleOrdenFormChange = (e) => {
    const { name, value } = e.target;
    setOrdenFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrdenFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedOrden) {
        await ordenCompraService.update(selectedOrden.id, ordenFormData);
      } else {
        await ordenCompraService.create(ordenFormData);
      }
      fetchOrdenesCompra();
      resetOrdenForm();
    } catch (error) {
      console.error("Error al guardar orden de compra:", error);
      alert("Error al guardar la orden de compra");
    }
  };

  const editOrden = (orden) => {
    setSelectedOrden(orden);
    setOrdenFormData({
      NroOrdenC: orden.NroOrdenC,
      fechaEmision: orden.fechaEmision,
      Situacion: orden.Situacion,
      Total: orden.Total,
      CodLab: orden.CodLab,
      NrofacturaProv: orden.NrofacturaProv,
    });
    setShowOrdenForm(true);
  };

  const deleteOrden = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta orden de compra?")) {
      try {
        await ordenCompraService.delete(id);
        // Actualizar el estado local directamente además de hacer la petición
        setOrdenesCompra(ordenesCompra.filter((orden) => orden.id !== id));
        // También hacer la petición para mantener la sincronización con el backend
        fetchOrdenesCompra();
      } catch (error) {
        console.error("Error al eliminar orden de compra:", error);
        alert("Error al eliminar la orden de compra");
      }
    }
  };

  const resetOrdenForm = () => {
    setSelectedOrden(null);
    setOrdenFormData({
      NroOrdenC: "",
      fechaEmision: "",
      Situacion: "",
      Total: "",
      CodLab: "",
      NrofacturaProv: "",
    });
    setShowOrdenForm(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Panel de Administrador</h1>

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
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Gestión de Laboratorios</h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowLabForm(!showLabForm)}
              >
                {showLabForm ? "Cancelar" : "Nuevo Laboratorio"}
              </button>
            </div>

            {showLabForm && (
              <div className="bg-gray-100 p-4 mb-4 rounded">
                <h3 className="text-lg font-medium mb-2">
                  {selectedLaboratorio
                    ? "Editar Laboratorio"
                    : "Nuevo Laboratorio"}
                </h3>
                <form onSubmit={handleLabFormSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Código</label>
                      <input
                        type="text"
                        name="CodLab"
                        value={labFormData.CodLab}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Razón Social</label>
                      <input
                        type="text"
                        name="razonSocial"
                        value={labFormData.razonSocial}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Dirección</label>
                      <input
                        type="text"
                        name="direccion"
                        value={labFormData.direccion}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={labFormData.telefono}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={labFormData.email}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Contacto</label>
                      <input
                        type="text"
                        name="contacto"
                        value={labFormData.contacto}
                        onChange={handleLabFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                      onClick={resetLabForm}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {selectedLaboratorio ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            )}

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
                    <th className="py-2 px-4 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratorios.map((lab) => (
                    <tr key={lab.id}>
                      <td className="py-2 px-4 border-b">{lab.CodLab}</td>
                      <td className="py-2 px-4 border-b">{lab.razonSocial}</td>
                      <td className="py-2 px-4 border-b">{lab.direccion}</td>
                      <td className="py-2 px-4 border-b">{lab.telefono}</td>
                      <td className="py-2 px-4 border-b">{lab.email}</td>
                      <td className="py-2 px-4 border-b">{lab.contacto}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => editLaboratorio(lab)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => deleteLaboratorio(lab.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ordenesCompra" && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Gestión de Órdenes de Compra
              </h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowOrdenForm(!showOrdenForm)}
              >
                {showOrdenForm ? "Cancelar" : "Nueva Orden de Compra"}
              </button>
            </div>

            {showOrdenForm && (
              <div className="bg-gray-100 p-4 mb-4 rounded">
                <h3 className="text-lg font-medium mb-2">
                  {selectedOrden
                    ? "Editar Orden de Compra"
                    : "Nueva Orden de Compra"}
                </h3>
                <form onSubmit={handleOrdenFormSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Número de Orden</label>
                      <input
                        type="text"
                        name="NroOrdenC"
                        value={ordenFormData.NroOrdenC}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Fecha de Emisión</label>
                      <input
                        type="date"
                        name="fechaEmision"
                        value={ordenFormData.fechaEmision}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Situación</label>
                      <select
                        name="Situacion"
                        value={ordenFormData.Situacion}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>
                        <option value="Completada">Completada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Total</label>
                      <input
                        type="number"
                        name="Total"
                        value={ordenFormData.Total}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Código Laboratorio</label>
                      <select
                        name="CodLab"
                        value={ordenFormData.CodLab}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Seleccionar</option>
                        {laboratorios.map((lab) => (
                          <option key={lab.id} value={lab.CodLab}>
                            {lab.CodLab} - {lab.razonSocial}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">
                        Nro. Factura Proveedor
                      </label>
                      <input
                        type="text"
                        name="NrofacturaProv"
                        value={ordenFormData.NrofacturaProv}
                        onChange={handleOrdenFormChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                      onClick={resetOrdenForm}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {selectedOrden ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            )}

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
                    <th className="py-2 px-4 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesCompra.map((orden) => (
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
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => editOrden(orden)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => deleteOrden(orden.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
