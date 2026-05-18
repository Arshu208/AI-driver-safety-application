import { useRouteError } from "react-router-dom";
import Button from "../app/components/Button";

export default function ErrorFallback() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-error">⚠️</span>
      </div>
      <h1 className="text-3xl mb-4 font-bold">Something went wrong.</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        {error?.message || "An unexpected application error occurred."}
      </p>
      <Button onClick={() => window.location.reload()}>
        Reload Application
      </Button>
    </div>
  );
}
