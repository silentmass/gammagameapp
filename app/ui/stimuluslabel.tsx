'use client'

interface TargetFetched {
    label: string,
    id: number,
    selected: boolean
}

export default function StimulusLabel({ target, onClick }: { target: TargetFetched, onClick: any }) {
    return (
        <p
            className={`max-w-12 flex w-full justify-center border rounded bg-gradient-to-b from-zinc-200 pb-0 pt-0 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30 md:w-1/10`}
            key={target.id}

        >
            <button
                onClick={() => onClick(target)}
            >{target.label}</button>
        </p>
    );
}