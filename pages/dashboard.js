import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import NeonCard from "../components/NeonCard";

const GET_ME_QUERY = gql`
  query ObtenerMisDatos {
    me {
      id
      username
      status
    }
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const { data, loading, error } = useQuery(GET_ME_QUERY, {
    skip: isChecking,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const token = localStorage.getItem("neon_token");
    if (!token) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("neon_token");
    router.push("/");
  };

  if (isChecking)
    return (
      <div className="min-h-screen bg-gray-950 text-cyan-400 flex items-center justify-center font-mono">
        Verificando credenciales...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans relative overflow-hidden p-8">
      <Head>
        <title>Dashboard Principal</title>
      </Head>

      <header className="flex justify-between items-center border-b border-cyan-500/30 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500">
          {loading
            ? "CARGANDO NÚCLEO..."
            : `BIENVENIDO, OPR-${data?.me?.username}`}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors rounded font-mono text-sm"
        >
          Desconectar [X]
        </button>
      </header>

      {/* 2. Usamos el componente y le pasamos las Props */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Identificador (Usa los colores por defecto) */}
        <NeonCard
          title="Identificador de Sesión"
          value={loading ? "..." : `#${data?.me?.id}`}
        />

        {/* Tarjeta 2: Estado (Sobrescribe los colores) */}
        <NeonCard
          title="Estado de Conexión"
          value={loading ? "..." : data?.me?.status}
          titleColor="text-fuchsia-400"
          valueColor={
            data?.me?.status === "OFFLINE" ? "text-red-400" : "text-green-400"
          }
          shadowColor="shadow-[0_0_15px_rgba(217,70,239,0.1)]"
        />

        {/* Tarjeta 3: Nueva tarjeta creada en 4 líneas */}
        <NeonCard
          title="Nivel de Autorización"
          value={loading ? "..." : "NIVEL 1"}
          titleColor="text-yellow-400"
          valueColor="text-yellow-400"
          shadowColor="shadow-[0_0_15px_rgba(250,204,21,0.1)]"
        />
      </main>
    </div>
  );
}
