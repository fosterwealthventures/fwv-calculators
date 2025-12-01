import dynamic from "next/dynamic";

// Client-only native ad, safe to render from server components via dynamic import.
const AdsterraNativeBanner = dynamic(
  () => import("./AdsterraNativeBanner"),
  { ssr: false },
);

export default function AdSlot({
  className = "",
  containerId,
}: {
  className?: string;
  containerId?: string;
}) {
  return (
    <div className={className}>
      <AdsterraNativeBanner containerId={containerId} />
    </div>
  );
}
