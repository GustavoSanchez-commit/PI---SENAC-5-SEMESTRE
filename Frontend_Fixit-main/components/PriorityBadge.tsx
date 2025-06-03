import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const safePriority = (priority || "").toLowerCase();

  switch (safePriority) {
    case "critica":
      return (
        <Badge variant="outline" className="border-purple-600 text-purple-600">
          Crítica
        </Badge>
      );
    case "alta":
      return (
        <Badge variant="outline" className="border-red-600 text-red-600">
          Alta
        </Badge>
      );
    case "media":
      return (
        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
          Média
        </Badge>
      );
    case "baixa":
      return (
        <Badge variant="outline" className="border-green-600 text-green-600">
          Baixa
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-slate-400 text-slate-400">
          Indefinida
        </Badge>
      );
  }
}
