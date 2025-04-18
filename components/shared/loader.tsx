import {Loader as LoadingIcon} from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: number;
  color?: string;
  icon?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  size = 20,
  color = "text-blue-900",
  icon,
}) => {
  return (
    <div className="mt-9 flex items-center justify-center gap-2 text-gray-900">
      {icon ? (
        icon
      ) : (
        <LoadingIcon
          className={`animate-spin ${color}`}
          width={size}
          height={size}
          aria-hidden="true"
        />
      )}
      <span
        className="text-sm"
        aria-live="assertive">
        {message}
      </span>
    </div>
  );
};
