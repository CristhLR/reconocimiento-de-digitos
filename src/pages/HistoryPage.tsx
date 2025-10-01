import { useEffect, useState } from "react";
import { clearHistory, loadHistory } from "../utils/history";
import type { HistoryEntry } from "../models/Image";

export default function HistoryPage() {
  const [rows, setRows] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setRows(loadHistory());
  }, []);

  const empty = rows.length === 0;

  return (
    <section className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Historial de peticiones</h1>
        {!empty && (
          <button
            className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700"
            onClick={() => {
              if (confirm("¿Borrar todo el historial?")) {
                clearHistory();
                setRows([]);
              }
            }}
          >
            Borrar todo
          </button>
        )}
      </div>

      {empty ? (
        <p className="text-slate-600">
          Aún no hay registros. Realiza una predicción en la sección
          “Reconocer”.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Archivo</th>
                <th className="p-2">Invertida</th>
                <th className="p-2">Predicción</th>
                <th className="p-2">Precisión</th>
                <th className="p-2">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="p-2">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2">{r.filename}</td>
                  <td className="p-2 text-center">{r.invert ? "Sí" : "No"}</td>
                  <td className="p-2 text-center">{r.prediction}</td>
                  <td className="p-2 text-center">
                    {r.accuracy <= 1
                      ? (r.accuracy * 100).toFixed(2)
                      : r.accuracy.toFixed(2)}
                    %
                  </td>
                  <td className="p-2 text-center">{r.process_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
