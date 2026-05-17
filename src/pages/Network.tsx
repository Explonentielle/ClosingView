import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { closers, mapClosers } from "@/data/mocks";

type Msg = { from: "me" | "them"; text: string; ts: number };

const MapFrance = () => (
  <div className="rounded-[12px] border-hair p-4 relative" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
    <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
      style={{ background: "#0EFF9C18", color: "#0EFF9C" }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
      127 closers actifs
    </div>

    <svg viewBox="0 0 380 320" className="w-full h-[280px]">
      {/* France schématique */}
      <path
        d="M 130 35 L 200 25 L 250 50 L 290 80 L 305 130 L 295 180 L 280 230 L 240 270 L 180 280 L 130 265 L 90 220 L 75 170 L 85 110 L 110 60 Z"
        fill="#0EFF9C08" stroke="#2a3a50" strokeWidth="0.8"
      />
      {mapClosers.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r="14" fill={c.color} fillOpacity="0.15" />
          <circle cx={c.cx} cy={c.cy} r="9"  fill={c.color} />
          <text x={c.cx} y={c.cy + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#0D1117">
            {c.score}
          </text>
        </g>
      ))}
    </svg>

    <div className="flex items-center gap-4 text-[10px] mt-2" style={{ color: "#8892a0" }}>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#0EFF9C" }} /> 70+</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#EFB027" }} /> 50–69</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} /> &lt;50</span>
    </div>
  </div>
);

const ArenaChat = () => {
  const onlineClosers = closers.filter((c) => c.online);
  const offlineClosers = closers.filter((c) => !c.online);
  const [activeId, setActiveId] = useState(1);
  const active = closers.find((c) => c.id === activeId)!;

  const [chats, setChats] = useState<Record<number, Msg[]>>({
    1: [
      { from: "them", text: "Salut Julien, ton score est solide 👌", ts: Date.now() - 60000 },
      { from: "me",   text: "Merci ! On échange sur ta niche ?",     ts: Date.now() - 30000 },
      { from: "them", text: "Carrément, je suis dispo.",             ts: Date.now() - 5000  },
    ],
  });
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [chats, activeId]);

  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setChats((c) => ({ ...c, [activeId]: [...(c[activeId] || []), { from: "me", text, ts: Date.now() }] }));
    setDraft("");
    if (active.online) {
      setTimeout(() => {
        setChats((c) => ({
          ...c,
          [activeId]: [...(c[activeId] || []), { from: "them", text: "Bien reçu, je te reviens.", ts: Date.now() }],
        }));
      }, 1200);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Closers premium</div>
          <div className="text-[22px] font-bold mt-1" style={{ color: "#EFB027" }}>43</div>
          <div className="text-[10px]" style={{ color: "#6b7a99" }}>sur 127 closers</div>
        </div>
        <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Ton rang régional</div>
          <div className="text-[22px] font-bold mt-1" style={{ color: "#EFB027" }}>#12</div>
          <div className="text-[10px]" style={{ color: "#6b7a99" }}>Île-de-France</div>
        </div>
        <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>En ligne</div>
          <div className="text-[22px] font-bold mt-1" style={{ color: "#0EFF9C" }}>12</div>
          <div className="text-[10px]" style={{ color: "#6b7a99" }}>closers actifs</div>
        </div>
      </div>

      {/* Premium banner */}
      <div
        className="rounded-[10px] border-hair px-4 py-2.5 flex items-center justify-between"
        style={{ background: "#EFB02712", borderColor: "#EFB02755" }}
      >
        <span className="text-[11px] font-bold" style={{ color: "#EFB027" }}>
          PREMIUM ACTIF · Messagerie déverrouillée · 9€/mois
        </span>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
      </div>

      {/* Messagerie */}
      <div className="grid grid-cols-[170px_1fr] gap-3 h-[440px]">
        {/* Liste */}
        <div className="rounded-[12px] border-hair overflow-y-auto" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          {onlineClosers.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="w-full text-left p-2.5 border-b-[0.5px] flex items-center gap-2 transition-150"
              style={{
                borderBottomColor: "#2a3a50",
                background: activeId === c.id ? "#0EFF9C06" : "transparent",
                borderLeft: activeId === c.id ? "2px solid #0EFF9C" : "2px solid transparent",
              }}
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: `${c.color}22`, color: c.color, border: `0.5px solid ${c.color}55` }}
                >{c.init}</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px]"
                  style={{ background: "#0EFF9C", borderColor: "#161d2e" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-white truncate">{c.name}</div>
                <div className="text-[9px] truncate" style={{ color: "#8892a0" }}>{c.niche}</div>
              </div>
              <span className="text-[9px] font-bold" style={{ color: c.color }}>{c.score}</span>
            </button>
          ))}
          <div className="px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-wider" style={{ color: "#6b7a99" }}>
            Hors ligne
          </div>
          {offlineClosers.map((c) => (
            <button key={c.id}
              onClick={() => setActiveId(c.id)}
              className="w-full text-left p-2.5 border-b-[0.5px] flex items-center gap-2 opacity-40 transition-150"
              style={{ borderBottomColor: "#2a3a50" }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: `${c.color}22`, color: c.color }}>{c.init}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-white truncate">{c.name}</div>
                <div className="text-[9px] truncate" style={{ color: "#8892a0" }}>{c.niche}</div>
              </div>
              <span className="text-[9px] font-bold" style={{ color: c.color }}>{c.score}</span>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="rounded-[12px] border-hair flex flex-col" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="flex items-center gap-3 p-3 border-b-[0.5px]" style={{ borderColor: "#2a3a50" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: `${active.color}22`, color: active.color, border: `0.5px solid ${active.color}55` }}>
              {active.init}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-bold text-white">{active.name}</div>
              <div className="text-[10px] flex items-center gap-1.5" style={{ color: "#8892a0" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active.online ? "#0EFF9C" : "#6b7a99" }} />
                {active.online ? "En ligne" : "Hors ligne"} · {active.niche}
              </div>
            </div>
            <span className="text-[11px] font-bold" style={{ color: active.color }}>Score {active.score}</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {(chats[activeId] || []).map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] text-[11px] px-3 py-2 rounded-[10px]"
                  style={
                    m.from === "me"
                      ? { background: "#0EFF9C", color: "#0D1117", fontWeight: 600 }
                      : { background: "#161d2e", color: "#FFFFFF", border: "0.5px solid #2a3a50" }
                  }
                >{m.text}</div>
              </div>
            ))}
            {(chats[activeId] || []).length === 0 && (
              <div className="text-center text-[11px] mt-10" style={{ color: "#6b7a99" }}>
                Début de la conversation avec {active.name}
              </div>
            )}
          </div>

          <div className="p-2.5 border-t-[0.5px] flex gap-2" style={{ borderColor: "#2a3a50" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écris un message…"
              className="flex-1 h-9 rounded-[10px] border-hair px-3 text-[11px] text-white"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }}
            />
            <button onClick={send}
              className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-150"
              style={{ background: "#0EFF9C", color: "#0D1117" }}><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Network = () => {
  const [tab, setTab] = useState<"map" | "arena">("map");

  return (
    <div className="animate-fade-in space-y-5 max-w-[1280px]">
      <div className="flex gap-1.5">
        {[
          { id: "map" as const,   label: "La Carte", color: "#0EFF9C" },
          { id: "arena" as const, label: "Arena",    color: "#EFB027" },
        ].map((t) => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 h-8 rounded-full text-[11px] font-bold border-hair transition-150"
            style={{
              background: tab === t.id ? t.color : "transparent",
              color: tab === t.id ? "#0D1117" : "#8892a0",
              borderColor: tab === t.id ? t.color : "#2a3a50",
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === "map" ? (
        <>
          <MapFrance />
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
              <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Closers</div>
              <div className="text-[22px] font-bold mt-1 text-white">127</div>
            </div>
            <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
              <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Score moy.</div>
              <div className="text-[22px] font-bold mt-1 text-white">63</div>
            </div>
            <div className="rounded-[12px] border-hair p-4" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
              <div className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Ton rang</div>
              <div className="text-[22px] font-bold mt-1" style={{ color: "#EFB027" }}>#12</div>
            </div>
          </div>
        </>
      ) : (
        <ArenaChat />
      )}
    </div>
  );
};

export default Network;
