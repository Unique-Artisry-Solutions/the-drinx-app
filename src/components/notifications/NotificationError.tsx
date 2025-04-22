
import { AlertCircle } from "lucide-react";

interface NotificationErrorProps {
  error: string;
}

export const NotificationError = ({ error }: NotificationErrorProps) => {
  return (
    <div className="border border-red-200 bg-red-50 p-4 rounded-md mb-4">
      <div className="flex items-center gap-2 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <p className="text-sm">Error: {error}</p>
      </div>
    </div>
  );
};
