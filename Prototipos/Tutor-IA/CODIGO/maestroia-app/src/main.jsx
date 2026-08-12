import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * SHIM DE window.storage
 * ------------------------------------------------------------
 * window.storage solo existe de forma nativa dentro de los
 * artifacts de Claude.ai. Fuera de ahí (como aquí, en tu
 * proyecto local) no existe — por eso la app se rompía al
 * arrancar. Este shim lo reemplaza con localStorage para que
 * el mismo código funcione en desarrollo local.
 *
 * Diferencia importante: localStorage es solo de TU navegador.
 * No es una base de datos compartida entre estudiantes como sí
 * lo es window.storage dentro de Claude.ai. Para producción real
 * (varios estudiantes viendo los mismos datos agregados) esto
 * debe vivir en un backend propio, tal como se explica en el
 * README.
 */
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const raw = localStorage.getItem(key);
      if (raw === null) throw new Error(`key not found: ${key}`);
      return { key, value: raw };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    async list(prefix = "") {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
      return { keys };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
