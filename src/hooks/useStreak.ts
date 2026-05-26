import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setStreak(0); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("daily_entries")
        .select("entry_date")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(400);
      if (cancelled) return;
      const set = new Set<string>((data ?? []).map((r: any) => r.entry_date));
      const today = new Date();
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      let n = 0;
      const cursor = new Date(today);
      // tolerate today not done yet — start from yesterday if today missing
      if (!set.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1);
      while (set.has(fmt(cursor))) {
        n++;
        cursor.setDate(cursor.getDate() - 1);
      }
      setStreak(n);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  return { streak, loading };
}
