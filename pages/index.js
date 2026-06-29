import Head from "next/head";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/router";

// 1. Mutación de LOGIN
const LOGIN_MUTATION = gql`
  mutation IniciarSesion($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user {
        id
        username
        status
      }
    }
  }
`;

// 2. Mutación de REGISTRO
const REGISTER_MUTATION = gql`
  mutation RegistrarOperador($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [iniciarSesion, { loading: loadingLogin }] =
    useMutation(LOGIN_MUTATION);
  const [registrarUsuario, { loading: loadingRegister }] =
    useMutation(REGISTER_MUTATION);

  const loading = isLoginMode ? loadingLogin : loadingRegister;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isLoginMode) {
        // --- LÓGICA DE LOGIN ---
        const response = await iniciarSesion({
          variables: { username, password },
        });

        const { token } = response.data.loginUser;
        localStorage.setItem("neon_token", token);

        // Añadimos el mensaje de bienvenida
        setSuccessMessage(
          "Acceso concedido. Estableciendo enlace con el núcleo...",
        );

        // Hacemos una pausa de 1.5 segundos antes de viajar al Dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        // --- LÓGICA DE REGISTRO ---
        const response = await registrarUsuario({
          variables: { username, password },
        });

        const newUser = response.data.registerUser.username;
        setSuccessMessage(
          `Operador ${newUser} registrado con éxito. Ya puede iniciar sesión.`,
        );
        setIsLoginMode(true);
        setPassword("");
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Error de conexión con el servidor principal.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>Terminal Neón - Acceso</title>
      </Head>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="border-b border-cyan-500/30 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="flex items-center justify-between p-6 container mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              SYS_NAV
            </span>
          </div>
        </nav>
      </header>

      <main className="mt-16 lg:mt-32 px-6 relative z-10">
        <section className="container mx-auto">
          <div className="w-full lg:flex items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-3 py-1 mb-6 border border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400 font-mono text-xs tracking-widest rounded shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                ESTADO:{" "}
                {isLoginMode ? "REQUIERE AUTENTICACIÓN" : "NUEVO REGISTRO"}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                {isLoginMode
                  ? "Acceso a la Red Principal"
                  : "Alta de Nuevo Operador"}
              </h1>
              <p className="text-lg lg:text-xl font-light text-cyan-100/60 mb-8 leading-relaxed">
                {isLoginMode
                  ? "Ingrese sus credenciales de administrador para validar su identidad y acceder al núcleo del sistema."
                  : "Registre su nuevo ID y clave de encriptación en la base de datos principal para obtener autorización."}
              </p>
            </div>

            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <form
                onSubmit={handleSubmit}
                className="bg-gray-900/60 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-xl p-8 lg:p-10"
              >
                <div className="mb-6">
                  <label
                    htmlFor="user_id"
                    className="mb-2 block text-cyan-400/80 font-mono text-sm tracking-widest uppercase"
                  >
                    ID de Usuario:
                  </label>
                  <input
                    type="text"
                    id="user_id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-950/80 text-cyan-300 rounded border border-gray-700 p-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all font-mono"
                    placeholder="OP-7734"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="encryption_key"
                    className="mb-2 block text-cyan-400/80 font-mono text-sm tracking-widest uppercase"
                  >
                    Clave de Encriptación:
                  </label>
                  <input
                    type="password"
                    id="encryption_key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-950/80 text-cyan-300 rounded border border-gray-700 p-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 border border-red-500/50 bg-red-500/10 rounded">
                    <p className="text-red-400 font-mono text-sm uppercase">
                      Error: {errorMessage}
                    </p>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-3 border border-green-500/50 bg-green-500/10 rounded">
                    <p className="text-green-400 font-mono text-sm uppercase">
                      {successMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (isLoginMode && successMessage !== "")}
                  className={`w-full py-4 font-bold tracking-widest uppercase rounded transition-all duration-300 focus:outline-none mb-4 ${
                    loading || (isLoginMode && successMessage !== "")
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-gray-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                  }`}
                >
                  {loading
                    ? "PROCESANDO..."
                    : isLoginMode
                      ? successMessage
                        ? "ENLAZANDO..."
                        : "Autenticar"
                      : "Registrar Operador"}
                </button>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-cyan-400/70 hover:text-cyan-300 font-mono text-sm tracking-widest uppercase underline decoration-cyan-500/30 underline-offset-4 transition-all"
                  >
                    {isLoginMode
                      ? "¿No tienes credenciales? Solicitar acceso"
                      : "¿Ya tienes acceso? Iniciar Sesión"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
