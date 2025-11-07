import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

export const Auth = () => {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/dashboard.html';
      }
    });
  }, []);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Lumen AI
          </h1>
          <p className="text-muted-foreground">
            Transforme livros em universos interativos
          </p>
        </div>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
        />
      </Card>
    </div>
    <Toaster />
    </>
  );
};
