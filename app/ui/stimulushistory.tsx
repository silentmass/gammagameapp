import { TargetFetched } from "@/app/ui/nback";
import StimulusLabel from "@/app/ui/stimuluslabel";

export default function StimulusHistory({ history }: { history: TargetFetched[] }) {
    return (
        <div className="min-h-8 z-10 grid grid-cols-10 place-items-center gap-1 max-w-2xl content-normal font-mono text-xs border-0 border-slate-500 p-1 rounded">
            {history.slice(-10).map((stimulus, idx) => (
                <StimulusLabel key={`${idx}_${stimulus.id}`} target={stimulus} onClick={() => ""} />
            ))}
        </div>
    );
}