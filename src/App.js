import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://examenparcial3web.onrender.com/api/supplier/sale";

const App = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ idSaller: "", suplierPrice: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener la lista de proveedores
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idSaller: formData.idSaller,
          suplierPrice: parseFloat(formData.suplierPrice)
        })
      });

      if (!response.ok) {
        throw new Error("Error al agregar proveedor");
      }

      setFormData({ idSaller: "", suplierPrice: "" });
      fetchSuppliers();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Gestión de Proveedores</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="idSaller"
          placeholder="ID del Vendedor"
          value={formData.idSaller}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="suplierPrice"
          placeholder="Precio del Proveedor"
          value={formData.suplierPrice}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Agregar"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <h2>Lista de Proveedores</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID Vendedor</th>
            <th>Precio Proveedor</th>
            <th>Precio Venta</th>
            <th>Ganancia Total</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.idSaller}</td>
              <td>${supplier.suplierPrice}</td>
              <td>${supplier.salePrice}</td>
              <td>${supplier.totalSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;