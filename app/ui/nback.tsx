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
    const [correctActionCount, setCorrectActionCount] = useState(0);

    const timerRef = useRef<number | null>(null);
    const stimulusHistoryRef = useRef<StimulusFetched[]>([]);
    const correctActionCountRef = useRef<number>(0);
    const selectClickedRef = useRef<boolean>(false);

    useEffect(() => {
        if (stimulusHistoryRef !== null) {
            stimulusHistoryRef.current = stimulusHistory;
            console.log('useEffect stimulusHistory');
        }
    }, [stimulusHistory]);

    useEffect(() => {
        correctActionCountRef.current = correctActionCount;
    }, [correctActionCount]);

    useEffect(() => {
        selectClickedRef.current = selectClicked;
    }, [selectClicked]);

    const getNewStimulusHistory = (stimulus: StimulusFetched | null) => {
        const newStimulusHistory = stimulus ? [...stimulusHistoryRef.current, stimulus] : stimulusHistoryRef.current;
        const nStimuli = newStimulusHistory.length;
        return { newStimulusHistory: newStimulusHistory, nStimuli: nStimuli };
    }

    function targetMatchNBack(stimulus: StimulusFetched) {
        // nback 2 and history 1
        // nback 1 and history 1
        // nback 1 and history 2
        const { newStimulusHistory, nStimuli } = getNewStimulusHistory(stimulus);
        if (newStimulusHistory.length > nback) {
            const res = nStimuli > nback && newStimulusHistory[nStimuli - 1].id === newStimulusHistory[nStimuli - 1 - nback].id;
            return res;
        } else {
            return false;
        }
    }

    function getRandomStimulus(start: number, stop: number) {
        const minInt = Math.ceil(start);
        const maxInt = Math.floor(stop);
        const randomStimulusIdx = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
        const newStimulus = newStimuli[randomStimulusIdx];
        return newStimulus;
    }


    function hideStimulus(): void {
        console.log("hideStimulus");
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

    const setSelectionLabel = (stimulus: StimulusFetched) => {
        if (!selectClicked) {
            setTargetStimulusMatches("NONE SELECTED");
        } else {
            if (targetMatchNBack(stimulus)) {
                setTargetStimulusMatches("MATCH");
            } else {
                setTargetStimulusMatches("NO MATCH");
            }
        }
    }

    const evaluateAction = (clicked: boolean, stimulus: StimulusFetched | null) => {
        const { newStimulusHistory, nStimuli } = getNewStimulusHistory(stimulus);
        const currentStimulus = newStimulusHistory[nStimuli - 1];

        if (clicked) {
            if (nStimuli > nback) {
                if (currentStimulus && targetMatchNBack(currentStimulus)) {
                    setCorrectActionCount(prevCount => prevCount + 1);
                    setTargetStimulusMatches(prevMatchCount => prevMatchCount + 1);
                }
            }
        } else {
            console.log('Evaluating no action');
            if (nStimuli > nback) {
                if (!targetMatchNBack(currentStimulus)) {
                    console.log('Point, stimuli do not match');
                    setCorrectActionCount(prevCount => prevCount + 1);
                } else {
                    console.log('No point, stimuli do match');
                }
            } else {
                if (nStimuli > 0) {
                    console.log('Point, not enough stimuli');
                    setCorrectActionCount(prevCount => prevCount + 1);
                } else {
                    console.log('No point, no stimuli');
                }
            }
        }
    }

    const startStimulusTimer = () => {
        // evaluate previous action
        if (!selectClickedRef.current) {
            evaluateAction(selectClickedRef.current, null);
            console.log(selectClicked, 'Previous evaluated');
        }
        if (selectClickedRef.current) {
            setSelectClicked(false);
            console.log('Setting clicked to false');
        }

        const newStimulus = getRandomStimulus(0, newStimuli.length - 1);
        const { newStimulusHistory, nStimuli } = getNewStimulusHistory(newStimulus);

        setShowTarget(true);
        showStimulus();
        setSelectionLabel(newStimulus);
        setStimulusHistory(prevHistory => [...prevHistory, newStimulus]);

        console.log(newStimulusHistory.length, targetMatchNBack(newStimulus) ? 'MATCH' : 'NO MATCH', newStimulus);

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
            console.log('Clicked');
            const currentStimulus = stimulusHistory[stimulusHistory.length - 1];
            evaluateAction(true, currentStimulus);
            console.log('Clicked', currentStimulus);
            setSelectionLabel(currentStimulus);
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
                            className={`text-4xl ${showTarget ? "" : "hidden"}`}
                        >
                            {stimulusHistory.length > 0 ? stimulusHistory[stimulusHistory.length - 1].label : ''}
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
                <p>{correctActionCount}|({stimulusHistoryRef.current.length})</p>
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
