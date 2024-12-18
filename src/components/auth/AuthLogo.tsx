import { Vault } from "lucide-react";

export const AuthLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary mb-8">
      <Vault className="h-8 w-8" />
      <span>IdeaVault</span>
    </div>
  );
};