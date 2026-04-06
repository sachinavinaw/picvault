import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export type AlertType = "warning" | "success" | "error" | "info";

type AlertProps = {
  alertType: AlertType;
  message: string;
};

const iconMap = {
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
} as const;

const alertStyles: Record<
  AlertType,
  { bg: string; text: string; icon: string }
> = {
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    icon: "text-yellow-800",
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-800",
    icon: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-800",
    icon: "text-red-800",
  },
  info: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    icon: "text-sky-800",
  },
};

const Alert = ({ alertType, message }: AlertProps) => {
  const Icon = iconMap[alertType];
  const style = alertStyles[alertType];
  const alertClassName = `p-4 mb-2 text-sm rounded-sm ${style.bg} ${style.text}`;

  return (
    <div className={alertClassName} role="alert">
      <div className="flex items-center gap-2 mb-2 font-medium">
        <Icon className={`h-5 w-5 ${style.icon}`} aria-hidden="true" />{" "}
        {message}
      </div>
    </div>
  );
};

export default Alert;
