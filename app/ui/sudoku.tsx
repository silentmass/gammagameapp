import { useEffect, useRef, useState } from "react";

export default function Sudoku() {
    const [cellIndex, setCellIndex] = useState(0);
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

    const cellValuesRef = useRef<{ [key: number]: number | null }>(cellValues);

    useEffect(() => {
        cellValuesRef.current = cellValues;
    }, [cellValues])

    const sudokuNumbersList = [1, 2, 3, 4];

    const cellMatrixShape = { m: 4, n: 4 };
    const cellMatrixIndices: number[][] = [];

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

    function isValidCellValue(cellMatrix: (number | null)[][], row: number, col: number, cellValue: number | null) {
        // Check global matrix

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
                if (cellMatrix[i + startRow][j + startCol] == cellValue) {
                    return false;
                }
            }
        }
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

    const buttonClassName = `p-1 text-xs border border-slate-500 rounded hover:bg-slate-500 active:bg-slate-700 focus:ring bg-slate-500/0`;

    return (
        <div className="flex flex-col gap-y-6 p-3 min-w-full">
            <div className={`grid ${'grid-cols-' + cellMatrixShape.m} gap-3`}>
                {cellMatrixIndices.map((e1, i1) => (e1.map((e2, i2) => (
                    <div key={e2} className={`flex size-16 p-3 w-full justify-center items-center border rounded ${getCellBackgroundColor(e2, neighbourCellIndices)}`}>
                        <p className="text-xl text-center">{cellValues[e2] ? cellValues[e2] : ''}</p>
                    </div>
                ))
                ))}
            </div>
            <div className="flex gap-x-3 justify-center items-center">
                <button className={buttonClassName}
                    onClick={() => {
                        logNeighbourCellIndices(cellIndex, cellMatrixShape);
                    }}>Get neighbours</button>
                <button className={buttonClassName}
                    onClick={() => setCellIndex(prevIndex => prevIndex + 1)}>Increase cell index ({cellIndex})</button>
                <button className={buttonClassName}
                    onClick={() => initCellNumbers()} >Init numbers</button>
            </div>
        </div>
    );
}