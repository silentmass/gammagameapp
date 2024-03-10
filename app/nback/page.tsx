import Nback from '@/app/ui/nback';
import CanvasWrapper from '@/app/ui/canvasWrapper';

export default function Page() {

    return (
        <CanvasWrapper>
            <Nback stimulusDuration={400} interStimulusInterval={1600} forcedChoice={null} >
                <></>
            </Nback>
        </CanvasWrapper>
    );
}
