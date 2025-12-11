import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Authenticated } from "convex/react";

export const Route = createFileRoute("/_layout/signIn")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn } = useAuthActions();

  const navigate = Route.useNavigate();

  return (
    <>
      <Authenticated>
        <Navigate to="/" />
      </Authenticated>
      <Button
        onClick={() => navigate({ to: "/" })}
        className="size-10 fixed top-4 left-4 cursor-pointer"
        variant="ghost"
      >
        <ArrowLeftIcon className="size-5" />
      </Button>
      <div className="w-full flex flex-col gap-20 items-center pt-48 px-4">
        <div className="flex flex-col gap-10 items-center">
          <span className="text-4xl font-medium text-center">Welcome</span>
          <div className="text-lg font-medium text-muted-foreground -mt-2 text-center max-w-prose">
            Login or sign up
          </div>
        </div>
        <button
          className="bg-primary rounded-xl text-primary-foreground px-8 py-3 cursor-pointer font-medium flex flex-row items-center gap-3 hover:bg-primary/90 transition-colors"
          onClick={() =>
            signIn("google", {
              redirectTo: "/",
            })
          }
        >
          <img src="/google.svg" alt="Google" className="size-6" />
          Continue with Google
        </button>
      </div>
    </>
  );
}
