import Head from "next/head";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

// 1. Definimos la misma orden que usaste en el Sandbox
const REGISTRO_MUTATION = gql`
  mutation IniciarEnlace($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
      id
      username
      status
    }
  }
`;

export default function Home() {
  // 2. Creamos la "memoria" para los campos de texto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 3. Preparamos la función de Apollo
  const [iniciarEnlace, { data, loading, error }] =
    useMutation(REGISTRO_MUTATION);

  // 4. Qué ocurre al pulsar el botón
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar
    try {
      await iniciarEnlace({
        variables: { username, password },
      });
      // Limpiamos los campos tras el éxito
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Error en la conexión:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      <Head>
        <title>Terminal Neón</title>
      </Head>

      {/* Círculos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- BARRA DE NAVEGACIÓN (Se mantiene igual) --- */}
      <header className="border-b border-cyan-500/30 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="flex items-center justify-between p-6 container mx-auto">
          <div className="flex items-center gap-3">
            <svg
              className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 54 64"
              fill="currentColor"
            >
              <path d="M53.52,1.87l-22,5.39a1.61,1.61,0,0,1-1.23-.21L19.89.25a1.57,1.57,0,0,0-1.3-.19l-18,5.3A.77.77,0,0,0,0,6.09V16.87L18.59,11.4a1.57,1.57,0,0,1,1.3.19l10.4,6.79a1.53,1.53,0,0,0,1.23.21L54,13.09V2.23a.39.39,0,0,0-.39-.38Z"></path>
            </svg>
            <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              SYS_NAV
            </span>
          </div>
          <div className="text-sm font-mono text-cyan-400/70 hidden lg:flex gap-8 tracking-widest uppercase">
            <a
              href="#"
              className="hover:text-cyan-300 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all"
            >
              Módulos
            </a>
            <a
              href="#"
              className="hover:text-cyan-300 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all"
            >
              Red
            </a>
          </div>
          <div className="hidden lg:block">
            <button className="py-2 px-6 border border-cyan-500 text-cyan-400 font-mono tracking-widest uppercase text-sm hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all rounded">
              Desconectar
            </button>
          </div>
        </nav>
      </header>

      {/* --- SECCIÓN PRINCIPAL --- */}
      <main className="mt-16 lg:mt-32 px-6 relative z-10">
        <section className="container mx-auto">
          <div className="w-full lg:flex items-center gap-16">
            {/* Textos de la izquierda */}
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-3 py-1 mb-6 border border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400 font-mono text-xs tracking-widest rounded shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                ESTADO: EN LÍNEA
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                Acceso a la Red Principal
              </h1>
              <p className="text-lg lg:text-xl font-light text-cyan-100/60 mb-8 leading-relaxed">
                Establezca conexión con los servidores de núcleo. Ingrese sus
                credenciales de administrador para sincronizar los paquetes de
                datos y activar los protocolos de seguridad.
              </p>
            </div>

            {/* Formulario */}
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

                {/* Mensajes de respuesta dinámicos */}
                {error && (
                  <p className="text-red-400 mb-4 font-mono text-sm">
                    Error: Conexión rechazada.
                  </p>
                )}
                {data && (
                  <p className="text-fuchsia-400 mb-4 font-mono text-sm">
                    ¡Enlace establecido! Operador {data.registerUser.username}{" "}
                    registrado.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-bold tracking-widest uppercase rounded transition-all duration-300 focus:outline-none ${
                    loading
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-gray-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                  }`}
                >
                  {loading ? "PROCESANDO..." : "Inicializar Enlace"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
