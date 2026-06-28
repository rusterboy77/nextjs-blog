import { DataTypes } from "sequelize";
import sequelize from "../lib/database";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    // Definimos la columna del ID (Autoincremental)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // El ID de usuario que pedimos en el formulario (ej: OP-7734)
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // La "Clave de Encriptación" del formulario
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Podemos añadir un estado para saber si el operador está activo
    status: {
      type: DataTypes.STRING,
      defaultValue: "OFFLINE",
    },
  },
  {
    // Opciones extra
    tableName: "neon_users",
    timestamps: true, // Crea automáticamente las columnas createdAt y updatedAt

    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10); // Genera la sal con 10 rondas de coste
          user.password = await bcrypt.hash(user.password, salt); // Sobrescribe la clave con el hash seguro
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export default User;
