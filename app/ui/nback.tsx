'use client'

import { useEffect, useRef, useState } from "react";
import StimulusLabel from '@/app/ui/stimuluslabel';
import StimulusHistory from "@/app/ui/stimulushistory";

export const targets = [
    { label: "🍎" },
    { label: "🍊" },
    { label: "🍐" },
    { label: "🍇" },
];

export interface Stimulus {
    label: string
}

export interface TargetFetched {
    label: string,
    id: number,
    selected: boolean,
    visible: boolean
}

export interface ParadigmParameters {
    isTargetVisible: boolean,
    nback: number,
}



const getActionLabel = (action: boolean) => {
    if (action) {
        return 'SELECTED';
    } else {
        return 'NONE SELECTED';
    }
};

export default function Nback({ children, stimulusDuration, interStimulusInterval, forcedChoice }: { children: React.ReactNode, stimulusDuration: number | null, interStimulusInterval: number | null, forcedChoice: number | null }) {

    if (!stimulusDuration) {
        stimulusDuration = 400;
    };

    if (!interStimulusInterval) {
        interStimulusInterval = 1600 + stimulusDuration;
    }


    function fetchStimuli(targets: Stimulus[]) {
        return targets.map((stimulus, stimulusIdx) => ({ ...stimulus, id: stimulusIdx, selected: false, visible: true }));
    }


    const [fetchedTargetsList, setFetchedTargetsList] = useState(fetchStimuli(targets));
    const [paradigmParameters, setParadigmParameters] = useState<ParadigmParameters>({
        isTargetVisible: false,
        nback: 2,
    });
    const [shownTargetsList, setShownTargetsList] = useState<TargetFetched[]>([]);
    const [isTargetSelected, setIsTargetSelected] = useState(false);
    const [isActionCorrect, setIsActionCorrect] = useState(Boolean);
    const [isTargetVisible, setIsTargetVisible] = useState(false);
    const [correctActionCount, setCorrectActionCount] = useState(0);

    const timerRef = useRef<number | null>(null);
    const shownTargetsRef = useRef<TargetFetched[]>([]);
    const correctActionRef = useRef<boolean>(false);
    const correctActionCountRef = useRef<number>(0);
    const isTargetSelectedRef = useRef<boolean>(false);
    const targetOnRef = useRef<boolean>(false);

    useEffect(() => {
        if (shownTargetsRef !== null) {
            shownTargetsRef.current = shownTargetsList;
        }
    }, [shownTargetsList]);

    useEffect(() => {
        correctActionCountRef.current = correctActionCount;
    }, [correctActionCount]);

    useEffect(() => {
        isTargetSelectedRef.current = isTargetSelected;
    }, [isTargetSelected]);

    useEffect(() => {
        correctActionRef.current = isActionCorrect;
    }, [isActionCorrect]);

    useEffect(() => {
        targetOnRef.current = isTargetVisible;
    }, [isTargetVisible]);

    const getShownTargets = (stimulus: TargetFetched | null) => {
        const shownTargetsList = stimulus ? [...shownTargetsRef.current, stimulus] : shownTargetsRef.current;
        const nShownTargets = shownTargetsList.length;
        return shownTargetsList;
    }

    function targetMatchNBack(stimulus: TargetFetched) {
        // nback 2 and history 1
        // nback 1 and history 1
        // nback 1 and history 2
        const shownTargetsList = getShownTargets(stimulus);
        const nShownTargets = shownTargetsList.length;
        if (shownTargetsList.length > paradigmParameters.nback) {
            const targetMatches = nShownTargets > paradigmParameters.nback && shownTargetsList[nShownTargets - 1].id === shownTargetsList[nShownTargets - 1 - paradigmParameters.nback].id;
            return targetMatches;
        } else {
            return false;
        }
    }

    const getTargetMatchResultLabel = (stimulus: TargetFetched) => {
        return (targetMatchNBack(stimulus) ? 'MATCH' : 'NO MATCH');
    };

    function getRandomTarget(start: number, stop: number) {
        const minInt = Math.ceil(start);
        const maxInt = Math.floor(stop);
        const randomStimulusIdx = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
        const newTarget = fetchedTargetsList[randomStimulusIdx];
        return newTarget;
    }

    const evaluateAction = (isTargetSelected: boolean, stimulus: TargetFetched | null) => {
        const shownTargetsList = getShownTargets(stimulus);
        const nShownTargets = shownTargetsList.length;
        const currentStimulus = shownTargetsList[nShownTargets - 1];

        if (isTargetSelected && ((nShownTargets > paradigmParameters.nback) && (currentStimulus && targetMatchNBack(currentStimulus)))) {
            console.log('Evaluating click action');
            return true;
        } else if ((!isTargetSelected && nShownTargets > 0 && nShownTargets <= paradigmParameters.nback) || (!isTargetSelected && nShownTargets > paradigmParameters.nback && (currentStimulus && !targetMatchNBack(currentStimulus)))) {
            console.log('None selected. Point, not enough targets or targets do not match');
            return true;
        } else {
            console.log('None selected. No point, no targets');
            return false;
        }

    }

    function hideTarget(): void {
        console.log("hideTarget");
        setIsTargetVisible(false);

        const isActionCorrect = evaluateAction(isTargetSelectedRef.current, null);
        setIsActionCorrect(isActionCorrect);
        if (isActionCorrect) {
            setCorrectActionCount(previousCount => previousCount + 1);
        }

        const shownTargetsList = getShownTargets(null);
        const nShownTargets = shownTargetsList.length;
        const currentStimulus = shownTargetsList[nShownTargets - 1];

        const isCorrectActionCount = isActionCorrect ? correctActionCount + 1 : correctActionCount;
        console.log(isTargetSelectedRef.current, 'Previous evaluated');

    }

    function showTarget(duration: number): void {
        console.log("startShowTargetTimer")
        setIsTargetSelected(false);
        setIsTargetVisible(true);
        let timer = setTimeout(() => hideTarget(), duration);
    }

    function clearStimulusTimer() {
        console.log("Clear timer");

        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null; // Reset the timerRef after clearing the interval
        }
    }

    const startTargetTimer = (duration: number) => {
        const newTarget = getRandomTarget(0, fetchedTargetsList.length - 1);
        const shownTargetsList = getShownTargets(newTarget);
        const nShownTargets = shownTargetsList.length;
        setIsTargetVisible(true);

        setParadigmParameters(params => ({ ...params, isActionCorrect: false }));

        showTarget(duration);
        setShownTargetsList(prevStimuli => ([...prevStimuli, newTarget]));

        console.log(shownTargetsList.length, getTargetMatchResultLabel(newTarget), newTarget);
    }

    const startStopParadigm = (duration: number, stimulusInterval: number) => {
        if (timerRef.current) {
            clearStimulusTimer();

        } else {
            const timer = setInterval(() => startTargetTimer(duration), stimulusInterval);
            timerRef.current = Number(timer);
        }

    }

    function onTargetSelectClicked() {
        console.log('onTargetSelectClicked');
        if (isTargetVisible) {
            setIsTargetSelected(true);
        } else {
            console.log('Clicks when target is not visible are ignored');
        }
    }

    function getFeedbackLabelBackgroundColor(isActionCorrect: boolean) {
        if (isActionCorrect) {
            return 'bg-sky-950';
        } else {
            return 'bg-rose-950';
        }
    }

    function getActionFeedbackLabelBackground(isTargetVisible: boolean, isActionCorrect: boolean) {
        if (!isTargetVisible) {
            return getFeedbackLabelBackgroundColor(isActionCorrect);
        } else {
            return 'bg-black-500/0';
        }
    }

    const ActionLabel = ({ isTargetSelected }: { isTargetSelected: boolean }) => {
        if (isTargetSelected) {
            return 'SELECTED';
        } else {
            return 'NONE SELECTED';
        }
    }

    function showHideTarget(showTarget: boolean) {
        if (showTarget) {
            return '';
        } else {
            return 'hidden';
        }
    }

    const TargetComponentLabel = ({ targets }: { targets: TargetFetched[] }) => {
        if (targets.length > 0) {
            return targets[targets.length - 1].label;
        } else {
            return '';
        }
    }

    function getStartStopButton(selectedNback: number, buttonNback: number) {
        if (timerRef.current && selectedNback === buttonNback) {
            return " Stop";
        } else if (!timerRef.current && selectedNback === buttonNback) {
            return " Start";
        } else {
            return '';
        }
    }



    const ActionShownTargetsStats = ({ correctActionCount, shownTargetsCount }: { correctActionCount: number, shownTargetsCount: number }) => {
        return (
            <div className="z-10 max-w-2xl justify-self-center items-center font-mono border-slate-500 border-0 lg:flex space-x-4 rounded">
                <p>{correctActionCount}|({shownTargetsCount})</p>
            </div>
        );
    };

    return (
        <div className="flex flex-col space-y-4 h-full items-center">
            <div className="min-h-8 flex z-10 max-w-2xl items-center justify-center font-mono text-xl border-0 border-slate-500 p-1 rounded gap-1">
                {
                    fetchedTargetsList.map((stimulus) => (
                        <StimulusLabel key={`${stimulus.id}`} stimulus={stimulus} onClick={() => ""} />
                    ))
                }
            </div>
            <StimulusHistory history={shownTargetsList} />
            <div className='max-w-2xl h-full w-full flex-col items-center p-0 border border-slate-500 rounded'>
                <div className={`flex border-0 items-center justify-center rounded ${getActionFeedbackLabelBackground(isTargetVisible, isActionCorrect)}`}>
                    <p className={`text-xs border-0`}>
                        <ActionLabel isTargetSelected={isTargetSelected} />
                    </p>
                </div>
                <div className='flex min-h-14 relative w-full h-full justify-center items-center'>
                    <div>{children}</div>
                    <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border-0 rounded border-sky-500'>
                        <p className={`text-4xl ${showHideTarget(isTargetVisible)}`} >
                            <TargetComponentLabel targets={shownTargetsList} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="z-10 w-full max-w-2xl justify-self-center items-center font-mono border-slate-500 border-0 lg:flex space-x-4 pt-1 rounded">
                <button
                    className={`w-full max-w-2xl justify-self-center items-center border border-slate-500 p-3 rounded bg-black-500/0 focus:ring ${!paradigmParameters.isTargetVisible ? '' : 'hover:bg-slate-800 active:bg-slate-900'}`}
                    onClick={() => onTargetSelectClicked()}>
                    Select
                </button>
            </div>
            <ActionShownTargetsStats correctActionCount={correctActionCount} shownTargetsCount={shownTargetsList.length} />
            <div className={`flex z-10 max-w-2xl full-h items-center justify-self-center font-mono border-slate-500 border-0 lg:flex p-0 rounded ${timerRef.current ? 'space-x-0' : 'space-x-4'}`}>
                {[1, 2, 3, 4].map(nbackValue => (
                    <button
                        key={nbackValue}
                        className={`p-1 text-xs border border-slate-500 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring ${paradigmParameters.nback === nbackValue ? 'bg-slate-700' : 'bg-slate-500/0'} ${(paradigmParameters.nback !== nbackValue && timerRef.current) ? 'hidden' : ''}`}
                        onClick={() => {
                            setParadigmParameters(params => ({ ...params, nback: nbackValue }));
                            paradigmParameters.nback === nbackValue ? startStopParadigm(stimulusDuration, interStimulusInterval) : null;
                        }}>
                        {nbackValue}-Back {getStartStopButton(paradigmParameters.nback, nbackValue)}
                    </button>
                ))}
            </div>
        </div>

    );
}
