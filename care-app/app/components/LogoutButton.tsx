"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Button from "@/app/components/ui/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      onClick={onLogout}
      variant="secondary"
      size="md"
      style={{ width: "100%" }}
      aria-label="Log out"
    >
      Log out
    </Button>
  );
}
