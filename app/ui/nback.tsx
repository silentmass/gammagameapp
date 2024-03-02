'use client'

import { useEffect, useRef, useState } from "react";
import StimulusLabel from '@/app/ui/stimuluslabel';

export default function Nback({ children }: { children: React.ReactNode }) {

    const stimuli = [
        { label: "🍎" },
        { label: "🍊" }
    ];

    interface Stimulus {
        label: string
    }

    interface StimulusFetched {
        label: string,
        id: number,
        selected: boolean,
        visible: boolean
    }

    function fetchStimuli(stimuli: Stimulus[]) {
        return stimuli.map((stimulus, stimulusIdx) => ({ ...stimulus, id: stimulusIdx, selected: false, visible: true }));
    }


    const [newStimuli, setNewStimuli] = useState(fetchStimuli(stimuli));
    const [stimulusHistory, setStimulusHistory] = useState<StimulusFetched[]>([]);
    const [targetStimulusMatches, setTargetStimulusMatches] = useState("");
    const [stimulusTimerOn, setStimulusTimerOn] = useState(false);
    const [stimulusMatchesCount, setStimulusMatchesCount] = useState(0);
    const [nback, setNback] = useState(2);
    const [showTarget, setShowTarget] = useState(true);
    const Ref = useRef<number | null>(null);

    function getRandomStimulus(start: number, stop: number) {
        const minInt = Math.ceil(start);
        const maxInt = Math.floor(stop);
        const randomStimulusIdx = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
        const newStimulus = newStimuli[randomStimulusIdx];
        setStimulusHistory(prevHistory => [...prevHistory, { ...newStimulus, visible: true }]);
        console.log(stimulusHistory[stimulusHistory.length - 1]);

        setTargetStimulusMatches("");
    }


    function hideStimulus(): void {
        console.log("setTimeout");
        setShowTarget(false);
    }

    function showStimulus(start: number, stop: number): void {
        getRandomStimulus(start, stop);
        setShowTarget(true);
        console.log("showStimulus")
        let timer = setTimeout(() => hideStimulus(), 2000);
    }

    function clearStimulusTimer() {
        console.log("Clear timer");

        if (Ref.current !== null) {
            clearInterval(Ref.current);
            Ref.current = null; // Reset the ref after clearing the interval
        }
    }

    function startStimulusTimer() {
        console.log("Start timer");
        showStimulus(0, newStimuli.length - 1);
    }

    function startStopStimulusTimer() {
        if (!stimulusTimerOn) {
            setStimulusTimerOn(!stimulusTimerOn);
            const timer = setInterval(() => startStimulusTimer(), 3000);
            Ref.current = Number(timer);
        } else {
            setStimulusTimerOn(!stimulusTimerOn);
            clearStimulusTimer();
        }
    }


    function handleClick(selectedStimulus: StimulusFetched) {
        console.log(!selectedStimulus.selected);
        setNewStimuli(prevStimuli => {
            return prevStimuli.map(stimulus => {
                if (stimulus.id === selectedStimulus.id) {
                    return { ...stimulus, selected: !selectedStimulus.selected };
                } else {
                    return { ...stimulus };
                }
            })
        });
    }

    function targetMatchNBack(nback: number) {
        return stimulusHistory[stimulusHistory.length - 1] && stimulusHistory.length > nback && stimulusHistory[stimulusHistory.length - 1].id === stimulusHistory[stimulusHistory.length - 1 - nback].id;
    }

    function logTargetMatchNBack(nback: number) {
        if (targetMatchNBack(nback)) {
            console.log("Match")
            setStimulusMatchesCount(prevCount => prevCount + 1);
        } else {
            console.log("No match")
        }
        setTargetStimulusMatches(targetMatchNBack(nback) ? 'MATCH' : 'NO MATCH');
    }


    return (
        <>
            <div className="z-10 max-w-2xl min-h-12 h-full items-center justify-center font-mono text-xl lg:flex border border-slate-500 p-0 rounded">
                {
                    newStimuli.map((stimulus) => (
                        <StimulusLabel key={`${stimulus.id}`} stimulus={stimulus} onClick={handleClick} />
                    ))
                }
            </div>
            <div className="z-10 grid grid-cols-10 place-items-center gap-0 max-w-2xl min-h-12 h-full content-normal font-mono text-xs border border-slate-500 p-0 rounded">
                {
                    stimulusHistory.slice(-10).map((stimulus, idx) => (
                        <StimulusLabel key={`${idx}_${stimulus.id}`} stimulus={stimulus} onClick={() => ""} />
                    ))
                }
            </div>
            <div className='flex max-w-2xl w-full flex-col items-center p-0 border border-slate-500 rounded'>
                <div className="flex h-8 border-0 items-center justify-center">
                    <p className={`text-xs border-0`}>
                        {targetStimulusMatches}
                    </p>
                </div>
                <div className='flex relative w-full h-full justify-center items-center'>
                    {children}
                    <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border-0 rounded border-sky-500'>
                        <p
                            className={`text-4xl ${stimulusHistory[stimulusHistory.length - 1] && "visible" in stimulusHistory[stimulusHistory.length - 1] && showTarget ? "" : "hidden"}`}
                        >
                            {stimulusHistory[stimulusHistory.length - 1] && 'label' in stimulusHistory[stimulusHistory.length - 1] ? stimulusHistory[stimulusHistory.length - 1].label : ''}
                        </p>
                    </div>
                </div>
            </div>
            <div className="z-10 max-w-2xl justify-self-center items-center font-mono border-slate-500 border-0 lg:flex space-x-4 p-5 rounded">
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => logTargetMatchNBack(nback)}>
                    Select
                </button>
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => startStopStimulusTimer()}>
                    {stimulusTimerOn ? "Stop" : "Start"}
                </button>
                <p>{stimulusMatchesCount}|({stimulusHistory.length})</p>
            </div>
            <div className="z-10 max-w-2xl justify-center font-mono border-slate-500 border-0 lg:flex space-x-4 p-0 rounded">
                {[1, 2, 3, 4].map(nbackValue => (
                    <button
                        key={nbackValue}
                        className={`text-xs border border-slate-500 p-1 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring ${nback === nbackValue ? 'bg-slate-700' : 'bg-slate-500/0'}`}
                        onClick={() => setNback(nbackValue)}>
                        {nbackValue}-Back
                    </button>
                ))}
            </div>
        </>

    );
}
