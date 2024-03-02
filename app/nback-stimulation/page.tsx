'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import StimulusLabel from '@/app/ui/stimuluslabel';
import ConcentricCircles from '@/app/ui/concentric-circles';

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

export default function Page() {

    function fetchStimuli(stimuli: Stimulus[]) {
        return stimuli.map((stimulus, stimulusIdx) => ({ ...stimulus, id: stimulusIdx, selected: false, visible: true }));
    }


    const [newStimuli, setNewStimuli] = useState(fetchStimuli(stimuli));
    const [stimulusHistory, setStimulusHistory] = useState<StimulusFetched[]>([]);
    const [targetStimulus, setTargetStimulus] = useState({});
    const [targetStimulusMatches, setTargetStimulusMatches] = useState("");
    const [stimulusTimerOn, setStimulusTimerOn] = useState(false);
    const [stimulusMatchesCount, setStimulusMatchesCount] = useState(0);
    const [nback, setNback] = useState(2);
    const Ref = useRef(null);

    function getRandomStimulus(start: number, stop: number) {
        const minInt = Math.ceil(start);
        const maxInt = Math.floor(stop);
        const randomStimulusIdx = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
        console.log(newStimuli[randomStimulusIdx])
        const newStimulus = newStimuli[randomStimulusIdx];
        setTargetStimulus(newStimulus);
        setStimulusHistory(prevHistory => [...prevHistory, { ...newStimulus, visible: true }]);

        setTargetStimulusMatches("");
    }


    function hideStimulus(): void {
        console.log("setTimeout");
        setTargetStimulus({ ...targetStimulus, visible: false });
    }

    function showStimulus(start: number, stop: number): void {
        getRandomStimulus(start, stop);
        console.log("showStimulus")
        let timer = setTimeout(() => hideStimulus(), 2000);
    }

    function clearStimulusTimer(timer: number) {
        console.log("Clear timer");
        clearInterval(timer);
    }

    function startStimulusTimer() {
        console.log("Start timer");
        showStimulus(0, newStimuli.length - 1);
    }

    function startStopStimulusTimer() {
        if (!stimulusTimerOn) {
            setStimulusTimerOn(!stimulusTimerOn);
            Ref.current = setInterval(() => startStimulusTimer(), 3000);
        } else {
            setStimulusTimerOn(!stimulusTimerOn);
            clearStimulusTimer(Ref.current);
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
        return targetStimulus && stimulusHistory.length > nback && targetStimulus.id === stimulusHistory[stimulusHistory.length - 1 - nback].id;
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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-2xl w-full items-center justify-center font-mono text-4xl lg:flex border border-slate-500 p-5 rounded">
                {
                    newStimuli.map((stimulus) => (
                        <StimulusLabel key={`${stimulus.id}`} stimulus={stimulus} onClick={handleClick} />
                    ))
                }
            </div>
            <div className="grid grid-cols-10 gap-1 max-w-2xl w-full h-24 content-normal text-xs border border-slate-500 p-5 rounded">
                {
                    stimulusHistory.slice(-10).map((stimulus, idx) => (
                        <StimulusLabel key={`${idx}_${stimulus.id}`} stimulus={stimulus} onClick={() => ""} />
                    ))
                }
            </div>
            <div className='flex max-w-2xl w-full flex-col items-center p-24 border border-slate-500 rounded'>
                <div className="flex h-16 border-0 items-center justify-center">
                    <p className={`text-4xl border-0`}>
                        {targetStimulusMatches}
                    </p>
                </div>
                <div className='flex relative w-full h-full justify-center items-center'>
                    <ConcentricCircles />
                    <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border-0 rounded border-sky-500'>
                        {/* <p className='text-4xl  monospace'>🍎</p> */}
                        <p
                            className={`text-4xl ${"visible" in targetStimulus && targetStimulus.visible ? "" : "hidden"}`}
                        >
                            {targetStimulus?.label ?? ''}
                        </p>

                    </div>
                </div>
            </div>
            <div className="z-10 max-w-2xl w-full justify-center font-mono border-slate-500 border-0 lg:flex space-x-4 p-5 rounded">
                {[1, 2, 3, 4].map(nbackValue => (
                    <button
                        key={nbackValue}
                        className={`border border-slate-500 p-3 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring ${nback === nbackValue ? 'bg-slate-700' : 'bg-slate-500/0'}`}
                        onClick={() => setNback(nbackValue)}>
                        {nbackValue}-Back
                    </button>
                ))}
            </div>
            <div className="z-10 max-w-2xl w-full justify-center font-mono border-slate-500 border-0 lg:flex space-x-4 p-5 rounded">
                <p>{stimulusMatchesCount}|({stimulusHistory.length})</p>
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => logTargetMatchNBack(Number(nback))}>
                    Select
                </button>
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => startStopStimulusTimer()}>
                    {stimulusTimerOn ? "Stop" : "Start"}
                </button>
            </div>
        </main>
    );
}
