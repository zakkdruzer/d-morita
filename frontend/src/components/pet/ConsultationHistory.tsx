import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { API_BASE } from "../../apiBase";

// =====================================================
// Tipo flexible para usuario de auditoría.
// Puede venir como:
// - string (por ejemplo, un ObjectId sin populate)
// - objeto populated desde backend con username/email/_id
// - undefined si no existe
// =====================================================
type AuditUser =
  | string
  | {
      _id?: string;
      username?: string;
      email?: string;
    }
  | undefined;

// =====================================================
// Estructura de una consulta.
// Incluye datos clínicos + campos de auditoría.
// =====================================================
interface Consultation {
  _id?: string;
  fecha?: string;
  anamnesis?: string;
  examenFisico?: string;
  preDiagnostico?: string;
  observaciones?: string;
  tratamientos?: string;
  recomendacion?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

const ConsultationHistory: React.FC = () => {
  // =====================================================
  // Obtenemos el id de la mascota desde la URL.
  // Ejemplo: /mascota/123/historial-consultas
  // =====================================================
  const { id } = useParams<{ id: string }>();

  // Hook para navegar programáticamente entre rutas.
  const navigate = useNavigate();

  // =====================================================
  // Estado con la lista de consultas recuperadas desde API.
  // =====================================================
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Estado de carga inicial.
  const [loading, setLoading] = useState(true);

  // Estado de error para mostrar mensaje amigable.
  const [error, setError] = useState("");

  // =====================================================
  // Al montar el componente o cambiar el id,
  // cargamos el historial de consultas desde backend.
  // =====================================================
  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/pets/${id}/consultations`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el historial de consultas.");
        }

        return res.json();
      })
      .then((data) => {
        // Aseguramos que siempre sea arreglo.
        setConsultations(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Error al obtener historial:", err);
        setError("No se pudo cargar el historial de consultas.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // =====================================================
  // Formatea fechas ISO a una versión legible.
  // Si no existe o no es válida, muestra "No disponible".
  // =====================================================
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "No disponible";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "No disponible";

    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // =====================================================
  // Convierte createdBy / updatedBy en texto visible.
  // Prioridad:
  // 1. username
  // 2. email
  // 3. _id
  // 4. string directo
  // 5. No disponible
  // =====================================================
  const getUserLabel = (user?: AuditUser) => {
    if (!user) return "No disponible";

    if (typeof user === "string") {
      return user;
    }

    return user.username || user.email || user._id || "No disponible";
  };

  // =====================================================
  // Vista de carga.
  // =====================================================
  if (loading) {
    return <div className="p-8 text-center">Cargando historial...</div>;
  }

  // =====================================================
  // Vista de error.
  // =====================================================
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      {/* =================================================
          Encabezado del historial
          - título
          - botón para volver a la ficha
          - botón para crear nueva consulta
         ================================================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-teal-700">
          Historial de Consultas
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Botón seguro para volver al detalle de la mascota.
              Esto evita depender del botón "atrás" del navegador,
              que en tu caso puede romper el flujo. */}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/mascota/${id}`)}
          >
            Volver a la ficha
          </Button>

          {/* Acceso directo para ingresar una nueva consulta */}
          <Link to={`/mascota/${id}/consulta`}>
            <Button type="button" variant="primary">
              Nueva Consulta
            </Button>
          </Link>
        </div>
      </div>

      {/* =================================================
          Si no hay consultas registradas
         ================================================= */}
      {consultations.length === 0 ? (
        <p className="text-gray-500">
          No hay consultas registradas para esta mascota.
        </p>
      ) : (
        <div className="space-y-6">
          {consultations.map((consulta) => (
            <div
              key={consulta._id || `${consulta.fecha}-${consulta.anamnesis}`}
              className="border rounded-lg p-5 shadow-sm bg-gray-50"
            >
              {/* =========================================
                  Cabecera de cada consulta
                  - título
                  - botón editar
                 ========================================= */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Consulta {consulta.fecha || "Sin fecha"}
                  </h3>
                </div>

                {consulta._id && (
                  <Link to={`/mascota/${id}/editar-consulta/${consulta._id}`}>
                    <Button type="button" variant="outline">
                      Editar
                    </Button>
                  </Link>
                )}
              </div>

              {/* =========================================
                  Información clínica de la consulta
                 ========================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Anamnesis</p>
                  <p className="font-medium">
                    {consulta.anamnesis || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Examen Físico</p>
                  <p className="font-medium">
                    {consulta.examenFisico || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Pre-diagnóstico</p>
                  <p className="font-medium">
                    {consulta.preDiagnostico || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Observaciones</p>
                  <p className="font-medium">
                    {consulta.observaciones || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Tratamientos</p>
                  <p className="font-medium">
                    {consulta.tratamientos || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Recomendación</p>
                  <p className="font-medium">
                    {consulta.recomendacion || "No disponible"}
                  </p>
                </div>
              </div>

              {/* =========================================
                  Bloque de auditoría
                  Muestra:
                  - fecha de creación
                  - fecha de última modificación
                  - usuario creador
                  - usuario modificador
                 ========================================= */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Registrada el:</strong>{" "}
                  {formatDateTime(consulta.createdAt)}
                </p>
                <p>
                  <strong>Última modificación:</strong>{" "}
                  {formatDateTime(consulta.updatedAt)}
                </p>
                <p>
                  <strong>Creada por:</strong>{" "}
                  {getUserLabel(consulta.createdBy)}
                </p>
                <p>
                  <strong>Modificada por:</strong>{" "}
                  {getUserLabel(consulta.updatedBy)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory;