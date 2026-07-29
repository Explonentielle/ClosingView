import * as S from '@/pages/Clients.styles';

export const TypeSelector = ({
  types,
  onToggle,
}: {
  types: string[];
  onToggle: (type: string) => void;
}) => (
  <div>
    <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>
      Type
    </span>
    <div className="flex gap-2 mt-1.5">
      {[
        { id: "VSL", color: "#9B7FE8" },
        { id: "Challenge", color: "#3B82F6" },
      ].map(({ id, color }) => {
        const active = types.includes(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className="px-3 h-8 rounded-full text-[11px] font-bold border-hair flex items-center gap-1.5 transition-150"
            style={S.typeButtonStyle(active, color)}
          >
            {active && <span className="w-1.5 h-1.5 rounded-full" style={S.typeBadgeStyle(color)} />}
            {id}
          </button>
        );
      })}
    </div>
  </div>
);
