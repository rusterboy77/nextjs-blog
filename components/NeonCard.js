export default function NeonCard({
  title,
  value,
  titleColor = "text-cyan-400", // Valores por defecto por si olvidamos pasarlos
  valueColor = "text-gray-100",
  shadowColor = "shadow-[0_0_15px_rgba(34,211,238,0.1)]",
}) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 p-6 rounded-lg transition-all hover:border-gray-700 ${shadowColor}`}
    >
      <h2 className={`${titleColor} font-mono text-sm mb-2 uppercase`}>
        {title}
      </h2>
      <div className={`text-4xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}
