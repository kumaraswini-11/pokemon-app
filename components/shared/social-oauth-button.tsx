import { SocialProvider } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const SocialOAuthButton = ({
  provider,
  label,
  icon,
  formAction,
  disabled,
  className,
}: {
  provider: SocialProvider;
  label: string;
  icon: React.ReactNode;
  formAction: (formData: FormData) => void;
  disabled: boolean;
  className?: string;
}) => (
  <form action={formAction}>
    <Button
      variant="outline"
      size="lg"
      type="submit"
      name="action"
      value={provider}
      disabled={disabled}
      className={cn(
        "flex w-full items-center justify-center gap-3 px-2",
        className
      )}
    >
      {icon}
      <span className="capitalize">{label}</span>
    </Button>
  </form>
);
