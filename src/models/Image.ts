// src/models/Image.ts
export type ImageRecognitionResponse = {
  prediction: number;
  // accuracy puede venir en [0..1] o [0..100] según backend
  accuracy: number;
  // ej: "1.549772ms"
  process_time: string;
};

export type HistoryEntry = {
  id: string;
  // ISO string con fecha de la petición
  timestamp: string;
  filename: string;
  invert: boolean;
  // respuesta de la API
  prediction: number;
  accuracy: number;
  process_time: string;
};
