'use client'

import { useEffect, useRef, useState } from "react";
import StimulusLabel from '@/app/ui/stimuluslabel';

export default function Nback({ children, stimulusDuration, interStimulusInterval, forcedChoice }: { children: React.ReactNode, stimulusDuration: number | null, interStimulusInterval: number | null, forcedChoice: number | null }) {

    if (!stimulusDuration) {
        stimulusDuration = 400;
    };

    if (!interStimulusInterval) {
        interStimulusInterval = 1600;
    }

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
    const [targetStimulusMatches, setTargetStimulusMatches] = useState("NONE SELECTED");
    const [stimulusTimerOn, setStimulusTimerOn] = useState(false);
    const [stimulusMatchesCount, setStimulusMatchesCount] = useState(0);
    const [nback, setNback] = useState(2);
    const [showTarget, setShowTarget] = useState(true);
    const [selectClicked, setSelectClicked] = useState(false);

    const timerRef = useRef<number | null>(null);
    const stimulusHistoryRef = useRef<StimulusFetched[]>([]);

    useEffect(() => {
        if (stimulusHistoryRef !== null) {
            stimulusHistoryRef.current = stimulusHistory;
        }
    }, [stimulusHistory]);


    function getRandomStimulus(start: number, stop: number) {
        const minInt = Math.ceil(start);
        const maxInt = Math.floor(stop);
        const randomStimulusIdx = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
        const newStimulus = newStimuli[randomStimulusIdx];
        console.log(newStimulus);
        return newStimulus;
    }


    function hideStimulus(): void {
        console.log("setTimeout");
        setShowTarget(false);
    }

    function showStimulus(): void {

        console.log("showStimulus")
        if (stimulusDuration) {
            let timer = setTimeout(() => hideStimulus(), stimulusDuration);
        }
    }

    function clearStimulusTimer() {
        console.log("Clear timer");

        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null; // Reset the timerRef after clearing the interval
        }
    }

    function targetMatchNBack() {
        // nback 2 and history 1
        // nback 1 and history 1
        // nback 1 and history 2
        if (stimulusHistoryRef.current.length > nback) {
            const res = stimulusHistoryRef.current.length > nback && stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1].id === stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1 - nback].id;
            return res;
        } else {
            return false;
        }

    }

    const countCorrectAction = () => {
        setStimulusMatchesCount(prevCount => prevCount + 1);
    }


    function logTargetMatchNBack() {
        if (targetMatchNBack()) {
            console.log("Match")
            countCorrectAction();
        } else {
            console.log("No match")
        }
        setTargetStimulusMatches(targetMatchNBack() ? 'MATCH' : 'NO MATCH');
    }

    const startStimulusTimer = () => {
        console.log('startStimulusTimer', 'selectClicked:', selectClicked, 'stimulusHistory.length:', stimulusHistoryRef.current.length)
        // Evaluate forced choice action of not selecting a stimulus
        // None selected and stimulus history has data
        if (!selectClicked && (stimulusHistoryRef.current.length <= nback || !targetMatchNBack())) {
            // Force to correct if history length is smaller or equal to nback or
            countCorrectAction();
        };

        setSelectClicked(false);
        const newStimulus = getRandomStimulus(0, newStimuli.length - 1);
        setStimulusHistory(prevHistory => [...prevHistory, newStimulus]);
        setTargetStimulusMatches("NONE SELECTED");
        setShowTarget(true);
        showStimulus();
    }

    const startStopStimulusTimer = () => {
        if (!stimulusTimerOn) {
            setStimulusTimerOn(!stimulusTimerOn);
            if (interStimulusInterval) {
                const timer = setInterval(() => startStimulusTimer(), interStimulusInterval);
                timerRef.current = Number(timer);
            }
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

    function onSelectClick() {
        if (!selectClicked) {
            setSelectClicked(true);
            logTargetMatchNBack();
            console.log('Clicked');
        }
    }


    return (
        <>
            <div className="z-10 max-w-2xl h-full items-center justify-center font-mono text-xl lg:flex border border-slate-500 p-0 rounded">
                {
                    newStimuli.map((stimulus) => (
                        <StimulusLabel key={`${stimulus.id}`} stimulus={stimulus} onClick={handleClick} />
                    ))
                }
            </div>
            <div className="z-10 h-full grid grid-cols-10 place-items-center gap-0 max-w-2xl content-normal font-mono text-xs border border-slate-500 p-0 rounded">
                {
                    stimulusHistory.slice(-10).map((stimulus, idx) => (
                        <StimulusLabel key={`${idx}_${stimulus.id}`} stimulus={stimulus} onClick={() => ""} />
                    ))
                }
            </div>
            <div className='flex max-w-2xl h-full w-full flex-col items-center p-0 border border-slate-500 rounded'>
                <div className="flex border-0 items-center justify-center">
                    <p className={`text-xs border-0`}>
                        {targetStimulusMatches}
                    </p>
                </div>
                <div className='flex min-h-14 relative w-full h-full justify-center items-center'>
                    {children}
                    <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border-0 rounded border-sky-500'>
                        <p
                            className={`text-4xl ${stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1] && "visible" in stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1] && showTarget ? "" : "hidden"}`}
                        >
                            {stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1] && 'label' in stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1] ? stimulusHistoryRef.current[stimulusHistoryRef.current.length - 1].label : ''}
                        </p>
                    </div>
                </div>
            </div>
            <div className="z-10 max-w-2xl justify-self-center items-center font-mono border-slate-500 border-0 lg:flex space-x-4 p-5 rounded">
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => onSelectClick()}>
                    Select
                </button>
                <button
                    className="border border-slate-500 p-3 bg-black-500/0 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring"
                    onClick={() => startStopStimulusTimer()}>
                    {stimulusTimerOn ? "Stop" : "Start"}
                </button>
                <p>{stimulusMatchesCount}|({stimulusHistoryRef.current.length})</p>
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
