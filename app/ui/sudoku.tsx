import { useEffect, useRef, useState } from "react";


export default function Sudoku({ children }: { children: React.ReactNode }) {
    const sudokuNumbersList = [1, 2, 3, 4];

    const cellMatrixShape = { m: 4, n: 4 };
    const cellMatrixIndices: number[][] = [];

    const [cellIndex, setCellIndex] = useState(0);
    const [isVisibleNumPad, setIsVisibleNumPad] = useState(false);
    const [isVisibleSolution, setIsVisibleSolution] = useState(false);

    const [numPadPosition, setNumPadPosition] = useState({ x: 0, y: 0 });
    const [numPadCellIndex, setNumPadCellIndex] = useState(0);
    const [isDraggableNumPad, setIsDraggableNumPad] = useState(false);

    const [neighbourCellIndices, setNeighbourCellIndices] = useState<(number | null)[]>([]);
    const [cellValues, setCellValues] = useState<{ [key: number]: number | null }>({
        0: 2,
        1: null,
        2: null,
        3: 1,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
    });
    const dummyCellMatrix = new Array<number>(cellMatrixShape.m).fill(0).map(item => new Array(cellMatrixShape.n).fill(0));

    const [boardValues, setBoardValues] = useState<number[][] | null>(null);
    const [userInputBoardValues, setUserInputBoardValues] = useState<number[]>(dummyCellMatrix.flat());

    const cellIndexRef = useRef<number>(cellIndex);
    const cellValuesRef = useRef<{ [key: number]: number | null }>(cellValues);
    const boardValuesRef = useRef<number[][] | null>(null);
    const userInputBoardValuesRef = useRef<number[]>(dummyCellMatrix.flat());

    useEffect(() => {
        cellIndexRef.current = cellIndex;
    }, [cellIndex])

    useEffect(() => {
        cellValuesRef.current = cellValues;
    }, [cellValues])

    useEffect(() => {
        boardValuesRef.current = boardValues;
    }, [boardValues])

    useEffect(() => {
        userInputBoardValuesRef.current = userInputBoardValues;
    }, [userInputBoardValues])

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         window.addEventListener('mouseup', (event) => {
    //             event.stopPropagation();
    //             console.log('Mouse up detected', event);
    //             setIsVisibleNumPad(false);
    //         });

    //     }
    //     return () => window.removeEventListener('mouseup', () => { });

    // }, [])




    for (let i = 0; i < cellMatrixShape.m; i++) {
        cellMatrixIndices[i] = [];
        for (let j = 0; j < cellMatrixShape.n; j++) {
            cellMatrixIndices[i][j] = i * cellMatrixShape.m + j;
        }
    }

    interface CellMatrixShape {
        m: number,
        n: number
    };

    function isValidCellValue(cellMatrix: (number | null)[][], row: number, col: number, cellValue: number | null): boolean {
        // Check global rows and cols

        for (let x = 0; x < cellMatrix.length; x++) {
            if (cellMatrix[row][x] === cellValue || cellMatrix[x][col] === cellValue) {
                return false;
            }
        }

        // Check local submatrix

        const subMatrixSideLength = (cellMatrix.length / 2);
        const startRow = row - row % subMatrixSideLength;
        const startCol = col - col % subMatrixSideLength;

        for (let i = 0; i < subMatrixSideLength; i++) {
            for (let j = 0; j < subMatrixSideLength; j++) {
                if (cellMatrix[i + startRow][j + startCol] === cellValue) {
                    return false;
                }
            }
        }
        return true;
    }

    function solveSudoku(cellMatrix: (number | null)[][]): boolean {
        const possibleCellValues = Array.from({ length: cellMatrix.length }, (_, i) => i + 1);
        const randomCellValues = new Array<number>(cellMatrix.length).fill(0);
        for (let k = 0; k < randomCellValues.length; k++) {
            // [1, 2, 3, 4] | [0, 0, 0, 0]
            // [2, 3, 4] | [1, 0, 0, 0]
            // [2, 3] | [1, 4, 0, 0]
            const availableCellValuesList = possibleCellValues.filter(item => !randomCellValues.includes(item));
            const newCellValue = availableCellValuesList[Math.floor(Math.random() * availableCellValuesList.length)];
            randomCellValues[k] = newCellValue;
        }

        for (let row = 0; row < cellMatrix.length; row++) {
            for (let col = 0; col < cellMatrix.length; col++) {
                if (cellMatrix[row][col] === 0) {
                    for (let cellValueIndex = 0; cellValueIndex < cellMatrix.length; cellValueIndex++) {
                        const cellValue = randomCellValues[cellValueIndex];
                        // console.log(cellValue, cellValueIndex, randomCellValues)
                        if (isValidCellValue(cellMatrix, row, col, cellValue)) {
                            cellMatrix[row][col] = cellValue;
                            if (solveSudoku(cellMatrix)) {
                                return true;
                            } else {
                                cellMatrix[row][col] = 0;
                            }
                        }
                    }
                    return false
                }
            }

        }
        return true;
    }

    function generateSudoku() {
        const size = cellMatrixIndices.length;
        let board = cellMatrixIndices.map(item => Array(item.length).fill(0));
        solveSudoku(board)
        setBoardValues(board);
        setUserInputBoardValues(dummyCellMatrix.flat());
        return board;
    }

    function getCellMatrixElement(cellMatrix: number[][], m: number, n: number): number | null {
        const isIndexOutside = ((m < 0 || n < 0)) || ((cellMatrix.length > 0 && cellMatrix.length < m + 1) || (cellMatrix.length > 0 && cellMatrix[0].length < n + 1));
        if (!isIndexOutside) {
            return cellMatrix[m][n]
        } else {
            return null;
        }
    }

    function checkIsEdgeCenterCell(m: number, n: number, cellRowIndex: number, cellColumnIndex: number) {
        const isCornerCell = (
            (cellRowIndex == 0 && cellColumnIndex == 0)
            || (cellRowIndex == 0 && cellColumnIndex == n - 1)
            || (cellRowIndex == m - 1 && cellColumnIndex == 0)
            || (cellRowIndex == m - 1 && cellColumnIndex == n - 1)
        );
        const isCenterCell = cellRowIndex !== 0 && cellColumnIndex !== 0 && cellRowIndex !== m - 1 && cellColumnIndex !== n - 1;
        const isEdgeCenterCell = !isCornerCell && !isCenterCell;
        return isEdgeCenterCell;
    }

    function getNeighbourCellIndices(cellIndex: number, cellMatrixShape: CellMatrixShape): (number | null)[] {
        const { m, n } = cellMatrixShape;
        const cellRowIndex = Math.floor(cellIndex / m);
        const cellColumnIndex = Math.floor(cellIndex - cellRowIndex * m);

        const cellMatrixRelativeIndices = [
            [[-1, -1], [-1, 0], [-1, 1]],
            [[0, -1], [0, 0], [0, 1]],
            [[1, -1], [1, 0], [1, 1]]
        ];

        const isEdgeCenterCell = checkIsEdgeCenterCell(m, n, cellRowIndex, cellColumnIndex);


        if (0 <= cellIndex && cellIndex < m * n) {
            const neighbourIndices = cellMatrixRelativeIndices.map((e1) => (e1.map((e2) => (
                getCellMatrixElement(cellMatrixIndices, e2[0] + cellRowIndex, e2[1] + cellColumnIndex)
            )))).flat().filter(item => (
                item !== null
                && item !== cellIndex
            ));

            if (isEdgeCenterCell) {
                const edgeCenterCells = neighbourIndices.filter(item => item !== null && checkIsEdgeCenterCell(m, n, Math.floor(item / m), Math.floor(item - Math.floor(item / m) * m)));
                const nonEdgeCenterCells = neighbourIndices.filter(item => item !== null && !edgeCenterCells.includes(item));
                // console.log(cellIndex, 'isEdgeCenterCell', isEdgeCenterCell, edgeCenterCells, nonEdgeCenterCells)
                return nonEdgeCenterCells;
            } else {
                // console.log(cellIndex, 'isEdgeCenterCell', isEdgeCenterCell, neighbourIndices)
                return neighbourIndices;
            }
        } else {
            console.log('Cell index not allowed!', cellIndex);
            return [];
        }

    }

    function logNeighbourCellIndices(cellIndex: number, cellMatrixShape: CellMatrixShape) {
        const neighbourIndices = getNeighbourCellIndices(cellIndex, cellMatrixShape);
        console.log(neighbourIndices);

        setNeighbourCellIndices(neighbourIndices);
    }

    const getCellBackgroundColor = (cellIndex: number, neighbourIndices: (number | null)[]) => {
        if (neighbourCellIndices.includes(cellIndex)) {
            return 'bg-slate-700';
        } else {
            return 'bg-black-500/0';
        }
    }

    function initCellNumbers() {
        setCellValues(previousValues => {
            const updatedValues = { ...previousValues };

            Object.keys(updatedValues).forEach(key => {
                const cellIndex = Number(key);

                if (updatedValues[cellIndex] == null) {

                    console.log(cellIndex, updatedValues);

                    const neighbourCellIndices = getNeighbourCellIndices(cellIndex, cellMatrixShape);
                    const neighbourCellValues = neighbourCellIndices
                        .map((i) => updatedValues[Number(i)])
                        .filter(item => item !== null);

                    const { m, n } = cellMatrixShape;
                    const cellRowIndex = Math.floor(cellIndex / m);
                    const cellColumnIndex = Math.floor(cellIndex - cellRowIndex * m);

                    const rowValues = cellMatrixIndices[cellRowIndex].flat().map((item) => updatedValues[item]);
                    const colValues = cellMatrixIndices[cellColumnIndex].flat().map((item) => updatedValues[item]);

                    const uniqueNeighbourCellValues: (number | null)[] = []
                    for (let i = 0; i < neighbourCellValues.length; i++) {
                        if (neighbourCellValues[i] !== null && !uniqueNeighbourCellValues.includes(neighbourCellValues[i])) {
                            uniqueNeighbourCellValues.push(neighbourCellValues[i]);
                        }
                    }

                    console.log(cellIndex, uniqueNeighbourCellValues, Object.values(updatedValues).map((item) => item).filter(item => item !== null));

                    const uniqueCellValues = sudokuNumbersList.filter(item => (
                        item !== null
                        && ![...Object.values(updatedValues).map((item) => item).filter(item => item !== null)].includes(item)));

                    const randomCellValue = uniqueCellValues.length > 0 ? uniqueCellValues[Math.floor(Math.random() * uniqueCellValues.length)] : sudokuNumbersList[Math.floor(Math.random() * sudokuNumbersList.length)];

                    // console.log(cellIndex, randomCellValue, uniqueCellValues);
                    updatedValues[cellIndex] = randomCellValue;
                }

            });

            return updatedValues;

        });

        console.log(cellValues);
    }

    function reshapeArray(flatArray: number[], elementsPerSubArray: number) {
        let reshapedArray = [];
        for (let i = 0; i < flatArray.length; i += elementsPerSubArray) {
            reshapedArray.push(flatArray.slice(i, i + elementsPerSubArray));
        }
        return reshapedArray;
    }

    function checkUserInputValues(cellMatrix: number[][]) {
        for (let row = 0; row < cellMatrix.length; row++) {
            for (let col = 0; col < cellMatrix.length; col++) {
                const cellValue = cellMatrix[row][col];
                if (cellValue === 0) {
                    return false;
                } else if (!isValidCellValue(cellMatrix, row, col, cellValue)) {
                    console.log(cellValue);
                    return false;
                }
            }
        }
        return true;
    }

    function getNumPadValueByRelativePosition(relativeX: number, relativeY: number) {
        if (relativeY < 0.33) {
            if (relativeX < 0.5) {
                return 1;
            } else {
                return 2;
            }
        } else if (relativeY >= 0.33 && relativeY < 0.66) {
            if (relativeX < 0.5) {
                return 3;
            } else {
                return 4;
            }
        } else {
            return 0;
        }

    }
    function getTouchPadValueByRelativePosition(relativeX: number, relativeY: number) {
        // 
        const col = Math.floor(relativeX * 4);
        const row = Math.floor(relativeY * 4);
        console.log(row, col, row * 4 + col)
        // row 0 col 0 = 0
        // row 1 col 1 = 5
        return (row * 4 + col);
    }

    const buttonClassName = `p-1 text-xs border border-slate-500 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring bg-slate-500/0`;
    const gridCols = cellMatrixShape.m === 4 ? 'grid-cols-4' : '';
    const activeCellStyle = (activeCellIndex: number) => {
        if (activeCellIndex === cellIndex) {
            return 'border-sky-500 border-2';
        } else {
            return 'border';
        }
    };
    const activeNumPadCellStyle = (activeCellIndex: number) => {
        if (activeCellIndex === numPadCellIndex) {
            return 'border-sky-500 border-2 bg-slate-700';
        } else {
            return 'border';
        }
    };

    const numPadPlacement = isVisibleNumPad ? `` : 'hidden';
    // const numPadPlacement = isVisibleNumPad ? `absolute left-${numPadPosition.x.toString()} top-${numPadPosition.y.toString()}` : 'hidden';
    const gridNaviVisible = isVisibleNumPad ? 'hidden' : '';

    const boardValue = (row: number, col: number) => {
        if (boardValues !== null && boardValues[row][col] !== 0) {
            return boardValues[row][col]
        } else {
            return '';
        }
    }

    const solutionBoardValueBackground = (boardValue: number) => {
        if (boardValues !== null && (isVisibleSolution && userInputBoardValues[boardValue] === boardValues.flat()[boardValue])) {
            return 'bg-slate-700';
        } else {
            return '';
        }
    }

    return (
        <div id="big" className="flex flex-col gap-y-6 p-3 justify-center items-center " draggable="false">
            <div className="flex relative ">
                <div className="flex border border-slate-500">{children}</div>
                <div className="absolute justify-start h-full w-full top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border border-rose-500">
                    <div className={`grid ${gridCols} border border-sky-500 justify-center items-center w-full h-full`}>
                        {cellMatrixIndices.map((e1, i1) => (e1.map((e2, i2) => (
                            <div key={e2} className={`flex flex-col size-16 p-0 justify-center items-center border rounded ${solutionBoardValueBackground(e2)} ${getCellBackgroundColor(e2, neighbourCellIndices)} ${activeCellStyle(e2)}`}>
                                <div className="flex justify-center items-center w-full h-full text-xl"><p>{userInputBoardValues[e2] !== 0 ? userInputBoardValues[e2] : ''}</p></div>
                                <div className={`flex pr-1 pb-1 justify-end items-end w-full text-sm ${isVisibleSolution ? '' : 'hidden'}`}><p className="p-0">{boardValue(i1, i2)}</p></div>
                            </div>
                        ))
                        ))}
                    </div>
                </div>
            </div>


            <div
                id={`numpad`}
                className="border-0"

                onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touches = e.touches[0];
                    if (isVisibleNumPad) {
                        // Numpad
                        if ((touches.clientX < rect.left || touches.clientX > rect.right) || (touches.clientY < rect.top || touches.clientY > rect.bottom)) {
                            console.log('out', rect.left, touches.clientX)
                        } else {
                            const relativeX = (touches.clientX - rect.left) / rect.width;
                            const relativeY = (touches.clientY - rect.top) / rect.height;
                            console.log('in', rect.left, touches.clientX, (touches.clientX - rect.left) / rect.width, (touches.clientY - rect.top) / rect.height)

                            setNumPadCellIndex(getNumPadValueByRelativePosition(relativeX, relativeY));
                        }
                    } else {
                        // Touchpad
                        if ((touches.clientX < rect.left || touches.clientX > rect.right) || (touches.clientY < rect.top || touches.clientY > rect.bottom)) {
                            console.log('onTouchMove pad out', rect.left, touches.clientX)
                        } else {
                            const relativeX = (touches.clientX - rect.left) / rect.width;
                            const relativeY = (touches.clientY - rect.top) / rect.height;
                            console.log('onTouchMove pad in', rect.left, touches.clientX, (touches.clientX - rect.left) / rect.width, (touches.clientY - rect.top) / rect.height, cellIndex)

                            setCellIndex(getTouchPadValueByRelativePosition(relativeX, relativeY));

                        }
                    }

                }}
                onTouchEnd={(e) => {
                    console.log('onTouchEnd pad', isVisibleNumPad);
                    if (isVisibleNumPad) {
                        console.log('onTouchEnd', 'setUserInputBoardValues');
                        setIsVisibleNumPad(false);
                        const newUserInputBoardValues = [...userInputBoardValues.map((cellValue, i) => i === cellIndex ? numPadCellIndex : cellValue)];
                        setUserInputBoardValues(newUserInputBoardValues);
                        e.preventDefault();
                    }
                }}
            >
                <div className={`grid gap-0 ${gridCols} ${gridNaviVisible}`}>
                    {cellMatrixIndices.flat().map((e, i) => (
                        <div
                            id={`numPadValue${i}`}
                            className={`flex size-12 border ${activeCellStyle(i)}`}
                            key={i}
                            onMouseEnter={() => {
                                setCellIndex(i);
                                console.log(i);
                            }}
                            onClick={(e) => {
                                console.log(i, 'onClick', e.clientX, cellIndex);
                                if (i === cellIndex) {
                                    console.log('onClick')
                                    setIsVisibleNumPad(true);
                                    setNumPadPosition({ x: e.clientX, y: e.clientY });
                                }
                            }}

                            onMouseUp={() => {
                                console.log(i, 'MouseUp');
                            }}

                            onTouchStart={(e) => {
                                console.log('onTouchStart key');
                                if (cellIndex === i) {
                                    console.log('Same key');
                                    setIsVisibleNumPad(true);
                                } else {
                                    console.log('Different key');
                                }
                            }}

                            onTouchEnd={(e) => {
                                console.log('onTouchEnd key');
                            }}

                        >{ }</div>
                    ))}
                </div>
                <div
                    className={`grid gap-0 grid-cols-2 ${numPadPlacement}`}
                    onMouseLeave={() => {
                        console.log('onMouseLeave');
                        setIsVisibleNumPad(false);
                    }}
                >
                    {[1, 2, 3, 4, 0].map((cellValue, i) => (
                        <div
                            className={`flex min-w-24 min-h-24 justify-center items-center text-xl select-none ${Number(cellValue) === 0 ? 'col-span-2' : ''} ${activeNumPadCellStyle(cellValue)}`}
                            key={i}
                            onMouseOver={() => {
                                console.log(cellValue, 'MouseOver');
                                setNumPadCellIndex(cellValue);
                            }}

                            onMouseDown={() => {
                                if (isVisibleNumPad) {
                                    console.log('setNumPadCellIndex: ', cellValue, 'onMouseDown', 'cellIndex: ', cellIndex, isVisibleNumPad);
                                    const newUserInputBoardValues = [...userInputBoardValues.map((cellValue, i) => i === cellIndex ? numPadCellIndex : cellValue)];
                                    setUserInputBoardValues(newUserInputBoardValues);
                                    console.log(newUserInputBoardValues);
                                    setIsVisibleNumPad(false);
                                }

                            }}
                        >
                            <p className="text-center">{cellValue}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-x-24 justify-between pt-10">
                <button className={buttonClassName}
                    onClick={() => console.log(generateSudoku())} >Generate sudoku</button>
                {/* <button className={buttonClassName}
                    onClick={() => {
                        const reshapedNewArray = reshapeArray(userInputBoardValues, cellMatrixShape.m);
                        console.log(reshapedNewArray, checkUserInputValues(reshapedNewArray));
                    }} >Check user solution</button> */}
                <button
                    className={`${buttonClassName} ${boardValues !== null ? '' : 'hidden'}`}
                    onClick={() => setIsVisibleSolution(previousState => !previousState)} >{isVisibleSolution ? 'Hide computer solution' : 'Show computer solution'}</button>
            </div>
        </div >
    );
}