const ClientCardLoader = () => (
  <div
    className="rounded-[12px] border-hair p-4 flex flex-col gap-3 animate-pulse"
    style={{ background: "#1a2232", borderColor: "#2a3a50" }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full"
        style={{ background: "#2a3a50" }}
      />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded bg-[#2a3a50] w-3/4" />
        <div className="h-3 rounded bg-[#2a3a50] w-1/2" />
      </div>
    </div>

    <div className="flex gap-1.5 flex-wrap">
      <div className="h-5 rounded-full bg-[#2a3a50] w-20" />
      <div className="h-5 rounded-full bg-[#2a3a50] w-16" />
    </div>

    <div className="flex items-center justify-between border-t-[0.5px] pt-3" style={{ borderColor: "#2a3a50" }}>
      <div className="h-5 rounded bg-[#2a3a50] w-20" />
      <div className="h-4 rounded bg-[#2a3a50] w-16" />
    </div>
  </div>
);

export default ClientCardLoader;
