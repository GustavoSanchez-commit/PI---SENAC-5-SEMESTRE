"use client";

interface NoIncidentsMessageProps {
  isRegularUser: boolean;
}

export function NoIncidentsMessage({ isRegularUser }: NoIncidentsMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h3 className="mt-4 text-lg font-medium text-navy-900">
        Nenhum chamado encontrado
      </h3>
    </div>
  );
}
