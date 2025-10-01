import { useState } from "react";
import Swal from "sweetalert2";
import { toPng28x28, isImage } from "../../utils/image";
import { pushHistory } from "../../utils/history";
import type { ImageRecognitionResponse } from "../../models/Image";

const API_URL = "http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict";

export default function ImageForm() {
  const [invert, setInvert] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageRecognitionResponse | null>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!isImage(f)) {
      Swal.fire("Formato no soportado", "Usa PNG/JPG/BMP/GIF/WEBP.", "warning");
      setImage(null);
      setImagePreview(null);
      return;
    }
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!image) {
      Swal.fire(
        "Falta la imagen",
        "Selecciona una imagen antes de enviar.",
        "info"
      );
      return;
    }

    try {
      setLoading(true);

      // Normaliza a 28x28
      const normalized = await toPng28x28(image);

      const formData = new FormData();
      formData.append("invert", invert ? "true" : "false");
      formData.append("image", normalized);

      const resp = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        let msg = `Error ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j?.message ? `${msg}: ${j.message}` : msg;
        } catch {
          const t = await resp.text();
          if (t) msg = `${msg}: ${t}`;
        }
        throw new Error(msg);
      }

      const data = (await resp.json()) as ImageRecognitionResponse;
      setResult(data);

      // Guardar en historial
      pushHistory({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        filename: image.name,
        invert,
        prediction: data.prediction,
        accuracy: data.accuracy,
        process_time: data.process_time,
      });

      Swal.fire({
        icon: "success",
        title: "Predicción realizada",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      const error = err as Error;
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "No se pudo predecir",
        text: error.message ?? "Error desconocido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">
        Subir imagen para reconocimiento
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-blue-600"
            checked={invert}
            onChange={(e) => setInvert(e.target.checked)}
          />
          <span>Invertir imagen</span>
        </label>

        <div>
          <label className="block text-sm font-medium mb-1">
            Selecciona una imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2"
          />
          {image && (
            <p className="text-sm text-slate-600 mt-1">
              Archivo seleccionado:{" "}
              <span className="font-medium">{image.name}</span>
            </p>
          )}
        </div>

        {imagePreview && (
          <div className="flex items-center gap-4">
            <img
              src={imagePreview}
              alt="preview"
              className="h-16 w-16 object-contain border rounded-lg"
            />
            <p className="text-slate-500 text-sm">
              La imagen se normalizará a <b>28×28</b> PNG antes de enviarse.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Enviar"}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-slate-50 border rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-3">
            Resultado del reconocimiento
          </h2>
          <p className="text-lg">
            Predicción: <span className="font-bold">{result.prediction}</span>
          </p>
          <p>
            Precisión:{" "}
            <span className="font-semibold">
              {result.accuracy <= 1
                ? (result.accuracy * 100).toFixed(2)
                : result.accuracy.toFixed(2)}
              %
            </span>
          </p>
          <p>Tiempo de procesamiento: {result.process_time}</p>
        </div>
      )}
    </section>
  );
}
