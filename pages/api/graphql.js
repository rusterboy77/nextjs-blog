import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Añadimos el tipo AuthPayload y la mutación loginUser
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    status: String
  }

  # Este tipo especial devuelve tanto el token generado como los datos del usuario
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User]
    me: User
  }

  type Mutation {
    registerUser(username: String!, password: String!): User
    # Nueva orden para iniciar sesión
    loginUser(username: String!, password: String!): AuthPayload
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => await User.findAll(),
    me: async (_, __, context) => {
      if (!context.currentUser) {
        throw new Error("Acceso denegado: Token inválido o inexistente");
      }
      return await User.findByPk(context.currentUser.userId);
    },
  },
  Mutation: {
    registerUser: async (_, { username, password }) => {
      try {
        return await User.create({ username, password });
      } catch (error) {
        throw new Error("Error al crear el usuario. Posible ID duplicado.");
      }
    },

    // --- LÓGICA DE LOGIN CON JWT ---
    loginUser: async (_, { username, password }) => {
      // 1. El guardia busca al operador en la base de datos MySQL
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error("Credenciales incorrectas"); // No damos pistas si falla el usuario
      }

      // 2. El guardia compara la contraseña escrita con el hash de la base de datos
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Credenciales incorrectas"); // No damos pistas si falla la clave
      }

      // Actualizamos el estado del usuario a EN LÍNEA
      user.status = "ONLINE";
      await user.save();

      // 3. Si todo es correcto, fabricamos el Token JWT (La pulsera VIP)
      // En la empresa, 'CLAVE_SECRETA_FIRMA' estará oculta en un archivo .env
      const token = jwt.sign(
        { userId: user.id, role: "OPERATOR" },
        "CLAVE_SECRETA_FIRMA",
        { expiresIn: "8h" }, // El token se autodestruirá en 8 horas
      );

      // 4. Entregamos el token y los datos al frontend
      return {
        token,
        user,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// <-- NUEVO: Configuramos el "Contexto" para extraer el token de las cabeceras
export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // Buscamos la cabecera 'authorization' que envía tu Apollo Client
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", ""); // Limpiamos la palabra Bearer

    let currentUser = null;
    if (token) {
      try {
        // Intentamos decodificar el token con nuestra clave secreta
        currentUser = jwt.verify(token, "CLAVE_SECRETA_FIRMA");
      } catch (error) {
        console.log("Token expirado o manipulado");
      }
    }

    // Todo lo que devolvamos aquí, estará disponible en el parámetro 'context' de los resolvers
    return { req, res, currentUser };
  },
});
