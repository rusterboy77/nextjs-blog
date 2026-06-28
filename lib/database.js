import { Sequelize } from "sequelize";

// Configuramos los datos de conexión
// (Más adelante pasaremos esto a un archivo .env por seguridad)
const dbName = "neon_terminal_db";
const dbUser = "root";
const dbPassword = "mi_clave_secreta_root"; // La contraseña que pusiste en el Docker run
const dbHost = "192.168.1.34"; // <-- CAMBIA ESTO por la dirección IP local de tu NAS

let sequelize;

// Este condicional evita el problema de las múltiples conexiones en Next.js
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: "mysql",
    logging: false,
  });
} else {
  if (!global.sequelize) {
    global.sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: "mysql",
      logging: false, // Cambia a console.log si quieres ver las sentencias SQL puras
    });
  }
  sequelize = global.sequelize;
}

export default sequelize;
