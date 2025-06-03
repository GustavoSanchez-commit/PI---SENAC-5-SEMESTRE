import { CheckCircle2, Clock, HelpCircle } from "lucide-react";

interface StatusIconProps {
  status: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case "aberto":
    case "open":
      return <HelpCircle className="h-5 w-5" />;
    case "em_atendimento":
    case "in_progress":
      return <Clock className="h-5 w-5" />;
    case "solucionado":
    case "resolved":
    case "closed":
      return <CheckCircle2 className="h-5 w-5" />;
    default:
      return <HelpCircle className="h-5 w-5" />;
  }
};

export default StatusIcon;
