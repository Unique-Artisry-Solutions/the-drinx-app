
import { AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandling";

interface NotificationErrorProps {
  error: unknown;
}

export const NotificationError = ({ error }: NotificationErrorProps) => {
  const errorMessage = getErrorMessage(error);
  
  return (
    <div className="border border-red-200 bg-red-50 p-4 rounded-md mb-4">
      <div className="flex items-center gap-2 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <p className="text-sm">Error: {errorMessage}</p>
      </div>
    </div>
  );
};
