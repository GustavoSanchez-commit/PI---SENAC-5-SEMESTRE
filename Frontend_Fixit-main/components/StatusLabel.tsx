import { Badge } from "@/components/ui/badge";

interface StatusLabelProps {
  status: string;
}

export function StatusLabel({ status }: StatusLabelProps) {
  const getStatusLabel = (status: string | undefined) => {
    const safeStatus = typeof status === "string" ? status.toLowerCase() : "";
    switch (safeStatus) {
      case "aberto":
      case "open":
        return "Aberto";
      case "em_andamento":
      case "in_progress":
        return "Em andamento";
      case "solucionado":
      case "resolved":
      case "closed":
        return "Solucionado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const safeStatus = typeof status === "string" ? status.toLowerCase() : "";
    switch (safeStatus) {
      case "aberto":
      case "open":
        return "bg-red-100 text-red-500";
      case "em_andamento":
      case "in_progress":
        return "bg-yellow-100 text-yellow-600";
      case "em_atendimento":
        return "bg-blue-100 text-blue-600";
      case "solucionado":
      case "closed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <Badge
      className={`rounded-md px-2 py-1 text-base font-semibold ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
