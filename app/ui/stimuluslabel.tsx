'use client'

interface StimulusFetched {
    label: string,
    id: number,
    selected: boolean
}

export default function StimulusLabel({ stimulus, onClick }: { stimulus: StimulusFetched, onClick: any }) {
    return (
        <p
            className={`fixed left-0 top-0 flex w-full justify-center border-b border-${stimulus.selected ? 'red' : 'gray'}-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-${stimulus.selected ? 'red' : 'neutral'}-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30`}
            key={stimulus.id}

        >
            <button
                onClick={() => onClick(stimulus)}
            >{stimulus.label}</button>
        </p>
    );
}