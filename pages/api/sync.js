import sequelize from "../../lib/database";
import User from "../../models/User";

export default async function handler(req, res) {
  try {
    // Autenticamos la conexión con el NAS
    await sequelize.authenticate();
    console.log("Enlace establecido con el servidor principal.");

    // Sincronizamos el modelo (crea la tabla si no existe)
    // El alter: true modifica la tabla si añadimos columnas nuevas en el futuro
    await User.sync({ alter: true });

    res.status(200).json({
      status: "ÉXITO",
      message: "Base de datos conectada y tablas sincronizadas correctamente.",
    });
  } catch (error) {
    console.error("Error crítico de red:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Fallo al conectar con el servidor de base de datos.",
      error: error.message,
    });
  }
}
