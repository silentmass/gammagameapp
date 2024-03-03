import Nback from '@/app/ui/nback';

export default function Page() {

    return (
        <div className="flex min-h-screen flex-col justify-center items-center p-0">
            <Nback stimulusDuration={400} interStimulusInterval={1600} forcedChoice={null} >
                <></>
            </Nback>
        </div>
    );
}
