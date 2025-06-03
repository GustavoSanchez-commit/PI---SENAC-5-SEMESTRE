import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status.toUpperCase()) {
    case "ABERTO":
      return <Badge className="bg-red-500 hover:bg-red-600">Aberto</Badge>;
    case "EM_ANDAMENTO":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">Em Andamento</Badge>
      );
    case "SOLUCIONADO":
      return <Badge className="bg-green-500 hover:bg-green-600">Resolvido</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
}