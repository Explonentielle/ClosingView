import { useState } from "react";
import { Lock, Search, Users } from "lucide-react";

const TeaserCard = ({
  icon, color, title, count, preview,
}: {
  icon: React.ReactNode; color: string; title: string; count: string; preview: string;
}) => (
  <div className="relative rounded-[12px] border-hair p-5 overflow-hidden" style={{ background: "#161d2e", borderColor: "#2a3a50", minHeight: 200 }}>
    <div style={{ opacity: 0.3 }} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
        <div>
          <div className="text-[12px] font-bold text-white">{count}</div>
          <div className="text-[10px]" style={{ color: "#8892a0" }}>{title}</div>
        </div>
      </div>
      <div className="rounded-[8px] border-hair p-3 text-[11px] text-white" style={{ background: "#0D1117", borderColor: "#2a3a50" }}>
        {preview}
      </div>
      <div className="h-3 rounded-md shimmer" style={{ background: "#0D1117" }} />
      <div className="h-3 rounded-md shimmer w-3/4" style={{ background: "#0D1117" }} />
    </div>

    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
          <Lock size={20} color={color} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>Bientôt disponible</div>
      </div>
    </div>
  </div>
);

const Ecosystem = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(147);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/.+@.+\..+/)) return;
    setDone(true);
    setCount((c) => c + 1);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-[1100px]">
      {/* Hero */}
      <div
        className="relative rounded-[14px] border-hair p-8 overflow-hidden text-center"
        style={{
          background: "radial-gradient(circle at center, #0EFF9C0e, transparent 60%), #0D1117",
          borderColor: "#0EFF9C33",
        }}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider mb-4"
          style={{ background: "#0EFF9C18", color: "#0EFF9C" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
          EN DÉVELOPPEMENT
        </div>

        <h1 className="text-[30px] sm:text-[38px] font-bold text-white leading-tight">
          Le marché du closing <span style={{ color: "#0EFF9C" }}>arrive.</span>
        </h1>
        <p className="text-[13px] mt-2 max-w-[520px] mx-auto" style={{ color: "#8892a0" }}>
          Infopreneurs et closers se retrouvent sur une seule plateforme.
          Missions, recrutements, deals — tout au même endroit.
        </p>

        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="flex -space-x-2">
            {["AL", "SC", "MR"].map((i, idx) => (
              <div key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-[1.5px]"
                style={{
                  background: ["#0EFF9C22", "#EFB02722", "#9B7FE822"][idx],
                  color:      ["#0EFF9C",   "#EFB027",   "#9B7FE8"  ][idx],
                  borderColor: "#0D1117",
                }}
              >{i}</div>
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "#8892a0" }}>
            <span className="font-bold text-white">{count} closers</span> déjà en liste d'attente
          </span>
        </div>

        {!done ? (
          <form onSubmit={submit} className="mt-5 flex justify-center gap-2 max-w-[420px] mx-auto">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="flex-1 h-10 rounded-[10px] border-hair px-3 text-[12px] text-white"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }}
            />
            <button className="h-10 px-4 rounded-[10px] font-bold text-[12px] transition-150"
              style={{ background: "#0EFF9C", color: "#0D1117" }}>Rejoindre →</button>
          </form>
        ) : (
          <div className="mt-5 max-w-[420px] mx-auto rounded-[10px] p-3 text-[12px] font-bold"
            style={{ background: "#0EFF9C18", color: "#0EFF9C", border: "0.5px solid #0EFF9C55" }}>
            Tu es sur la liste — on te prévient en premier 🚀
          </div>
        )}
      </div>

      {/* 2 cards teasées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <TeaserCard
          icon={<Search size={16} />}
          color="#0EFF9C"
          title="Trouver une mission"
          count="98 offres disponibles"
          preview="Mastermind Elite · Dev perso · VSL · 20%"
        />
        <TeaserCard
          icon={<Users size={16} />}
          color="#EFB027"
          title="Être recruté"
          count="23 infopreneurs cherchent"
          preview="Thomas Coaching · Score min. 70 · Paris · Urgent"
        />
      </div>

      <div className="text-center">
        <div className="text-[10px]" style={{ color: "#2a3a50", letterSpacing: "6px" }}>
          · · · · · · · · · · · · · · ·
        </div>
        <p className="text-[11px] mt-3" style={{ color: "#8892a0" }}>
          Tu seras notifié(e) en avant-première.
        </p>
      </div>
    </div>
  );
};

export default Ecosystem;
