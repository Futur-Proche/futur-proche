import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

interface Props {
  eventId: string;
  capacite?: number | null;
  className?: string;
  iconSize?: number;
  variant?: "light" | "dark";
}

export const EventCountBadge = ({ eventId, capacite, className = "", iconSize = 13, variant = "dark" }: Props) => {
  const { data } = useQuery({
    queryKey: ["event-count", eventId],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_event_registrations_count", { _event_id: eventId });
      return (data as number | null) ?? 0;
    },
    staleTime: 30_000,
  });

  const count = data ?? 0;
  const color = variant === "light" ? "text-white/70" : undefined;

  return (
    <span className={`inline-flex items-center gap-1 ${color ?? ""} ${className}`}>
      <Users size={iconSize} />
      {capacite ? `${count}/${capacite} inscrits` : `${count} inscrit${count > 1 ? "s" : ""}`}
    </span>
  );
};
