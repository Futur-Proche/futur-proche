import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Member = {
  id: string;
  prenom: string;
  nom: string;
  photo_url: string | null;
};

type Bubble = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  member: Member;
};

export const MembersCloud = () => {
  const { data: members } = useQuery({
    queryKey: ["homepage-members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, prenom, nom, photo_url")
        .not("photo_url", "is", null)
        .limit(30);
      return data ?? [];
    },
  });

  const placeholders: Member[] = Array.from({ length: 24 }, (_, i) => ({
    id: `ph-${i}`,
    prenom: ["A", "C", "E", "G", "I", "K", "M", "O", "Q", "S", "U", "W"][i % 12],
    nom: ["B", "D", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X"][i % 12],
    photo_url: null,
  }));

  const displayMembers: Member[] = members?.length ? members : placeholders;

  return (
    <section className="section-navy relative">
      <div className="dot-grid" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="section-label">La communauté</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold tracking-tight mb-3 text-white">
          Ils sont déjà{" "}
          <span className="font-serif-accent text-primary">Futuristes.</span>
        </h2>
        <p className="text-base max-w-xl mb-10 leading-relaxed text-white/50">
          850+ leaders Marketing / Comm qui échangent chaque jour.{" "}
          <span className="text-white/35 font-mono text-sm">Cliquez et déplacez une bulle.</span>
        </p>

        <BubblePhysics members={displayMembers} />

        {!members?.length && (
          <p className="text-center text-xs mt-6 font-mono uppercase tracking-wider text-white/30">
            Photos bientôt connectées depuis l'espace admin
          </p>
        )}
      </div>
    </section>
  );
};

const BubblePhysics = ({ members }: { members: Member[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const dragRef = useRef<{
    id: string | null;
    lastX: number;
    lastY: number;
    offX: number;
    offY: number;
  }>({ id: null, lastX: 0, lastY: 0, offX: 0, offY: 0 });
  const downRef = useRef<{ id: string | null; x: number; y: number; moved: boolean }>({
    id: null,
    x: 0,
    y: 0,
    moved: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [, force] = useState(0);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Init bubbles
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    sizeRef.current = { w: rect.width, h: rect.height };

    // Seeded pseudo-random for stable initial layout
    const rand = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const maxR = Math.min(rect.width, rect.height) * 0.42;

    bubblesRef.current = members.map((m, i) => {
      const angle = rand(i + 1) * Math.PI * 2;
      const radius = Math.sqrt(rand(i + 7)) * maxR;
      const r = 26 + rand(i + 3) * 10;
      return {
        id: m.id,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: reducedMotion ? 0 : (rand(i + 11) - 0.5) * 0.4,
        vy: reducedMotion ? 0 : (rand(i + 13) - 0.5) * 0.4,
        r,
        member: m,
      };
    });
    force((v) => v + 1);

    const onResize = () => {
      const r = el.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [members, reducedMotion]);

  // Physics loop
  useEffect(() => {
    if (reducedMotion) return;

    const step = () => {
      const { w, h } = sizeRef.current;
      const bubbles = bubblesRef.current;
      const drag = dragRef.current;

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (b.id === drag.id) continue;

        // Tiny ambient drift
        b.vx += (Math.random() - 0.5) * 0.04;
        b.vy += (Math.random() - 0.5) * 0.04;

        // Friction
        b.vx *= 0.97;
        b.vy *= 0.97;

        b.x += b.vx;
        b.y += b.vy;

        // Walls
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = Math.abs(b.vx) * 0.6;
        } else if (b.x + b.r > w) {
          b.x = w - b.r;
          b.vx = -Math.abs(b.vx) * 0.6;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = Math.abs(b.vy) * 0.6;
        } else if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy = -Math.abs(b.vy) * 0.6;
        }
      }

      // Pairwise repulsion
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const c = bubbles[j];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const min = a.r + c.r + 2;
          if (dist < min) {
            const overlap = (min - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            if (a.id !== drag.id) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              a.vx -= nx * 0.25;
              a.vy -= ny * 0.25;
            }
            if (c.id !== drag.id) {
              c.x += nx * overlap;
              c.y += ny * overlap;
              c.vx += nx * 0.25;
              c.vy += ny * 0.25;
            }
          }
        }
      }

      force((v) => (v + 1) % 1000000);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const b = bubblesRef.current.find((x) => x.id === id);
    if (!b) return;
    dragRef.current = {
      id,
      lastX: px,
      lastY: py,
      offX: px - b.x,
      offY: py - b.y,
    };
    downRef.current = { id, x: px, y: py, moved: false };
    b.vx = 0;
    b.vy = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.id) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const b = bubblesRef.current.find((x) => x.id === drag.id);
    if (!b) return;
    const down = downRef.current;
    if (!down.moved) {
      const dx = px - down.x;
      const dy = py - down.y;
      if (dx * dx + dy * dy > 25) down.moved = true;
    }
    const nx = px - drag.offX;
    const ny = py - drag.offY;
    b.vx = (nx - b.x) * 0.5;
    b.vy = (ny - b.y) * 0.5;
    b.x = nx;
    b.y = ny;
    drag.lastX = px;
    drag.lastY = py;
    force((v) => (v + 1) % 1000000);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const down = downRef.current;
    if (down.id && !down.moved) {
      setSelectedId((prev) => (prev === down.id ? null : down.id));
    }
    downRef.current = { id: null, x: 0, y: 0, moved: false };
    dragRef.current.id = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        height: "min(560px, 70vh)",
        background:
          "radial-gradient(circle at 50% 50%, hsl(228 50% 14%) 0%, hsl(228 56% 10%) 70%)",
        border: "1px solid hsl(228 30% 22%)",
        touchAction: "none",
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {bubblesRef.current.map((b) => {
        const isSelected = selectedId === b.id;
        const isDragging = dragRef.current.id === b.id;
        return (
          <div
            key={b.id}
            onPointerDown={(e) => handlePointerDown(e, b.id)}
            className="absolute select-none cursor-grab active:cursor-grabbing"
            style={{
              left: b.x - b.r,
              top: b.y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              willChange: "transform",
              transition: isDragging ? "none" : "box-shadow 200ms",
              boxShadow:
                isDragging || isSelected
                  ? "0 0 30px hsl(186 79% 47% / 0.6)"
                  : "0 4px 12px hsl(228 56% 5% / 0.5)",
              borderRadius: "50%",
              zIndex: isSelected ? 20 : isDragging ? 15 : 1,
            }}
          >
            {b.member.photo_url ? (
              <img
                src={b.member.photo_url}
                alt={`${b.member.prenom} ${b.member.nom}`}
                draggable={false}
                className="w-full h-full rounded-full object-cover pointer-events-none"
                style={{
                  border: isSelected
                    ? "2px solid hsl(186 79% 47%)"
                    : "2px solid hsl(228 30% 28%)",
                }}
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center font-mono font-medium pointer-events-none"
                style={{
                  border: isSelected
                    ? "1px solid hsl(186 79% 47%)"
                    : "1px solid hsl(228 30% 28%)",
                  background: "hsl(228 40% 14%)",
                  color: "hsl(228 15% 65%)",
                  fontSize: b.r * 0.45,
                }}
              >
                {b.member.prenom[0]}
                {b.member.nom[0]}
              </div>
            )}
            {isSelected && (
              <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none font-mono"
                style={{
                  top: "100%",
                  marginTop: 8,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "hsl(228 56% 8%)",
                  border: "1px solid hsl(186 79% 47% / 0.5)",
                  color: "hsl(0 0% 100%)",
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 12px hsl(228 56% 5% / 0.6)",
                }}
              >
                {b.member.prenom} {b.member.nom?.[0]?.toUpperCase()}.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
