export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
        <p className="mt-4 text-slate-500">Carregando detalhes do chamado...</p>
      </div>
    </div>
  )
}
