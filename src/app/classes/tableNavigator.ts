interface Cell {
    row: number;
    column: number;
}

export class TableNavigator {
    private table: HTMLTableElement;
    private currentCell: Cell;

    constructor(table: HTMLTableElement) {
        this.table = table;
        this.currentCell = { row: 0, column: 0 };
        this.highlightCurrent();
        this.setupKeyboardNavigation();
        this.setupMouseNavigation(table);

    }

    public findRowButton(target: HTMLButtonElement): number {
        const rowsCollection = this.table.rows;
        let i = 0
        for (i = 0; i < rowsCollection.length; i++) {
            if (rowsCollection[i].cells[10].firstChild == target) {
                break;
            }
        }
        return i;
    }


    public boxChange(event: any) {
        const rowsCollection = this.table.rows;
        const j = rowsCollection.length;
        for (let i = 0; i < j; i++) {
            if ((rowsCollection[i].cells[0].firstChild!.firstChild as HTMLInputElement).checked && rowsCollection[i].cells[0].firstChild!.firstChild !== event.target) {
                (rowsCollection[i].cells[0].firstChild!.firstChild as HTMLInputElement).checked = false;
            }
        }
    }

    public findCheckedRowNumber(): number | null {
        const rowsCollection = this.table.rows;
        if (rowsCollection) {
            for (let i = 0; i < rowsCollection.length; i++) {
                if ((rowsCollection[i].cells[0].firstChild!.firstChild as HTMLInputElement).checked) {
                    return i;
                }
            }
        }
        return null;
    }

    public moveCheckbox(isMoveUp: boolean): number | null {
        const collection: any = this.table.rows;
        let j: number;
        if (collection) {
            j = collection.length;
        } else {
            return null;
        }
        let currentIndex = -1;
        for (let i = 0; i < j; i++) {
            if (collection[i].cells[0].firstChild.firstChild.checked) {
                currentIndex = i;
                break;
            }
        }
        if (currentIndex !== -1) {

            if (isMoveUp && currentIndex > 0) {
                collection[currentIndex].cells[0].firstChild.firstChild.checked = false;
                collection[currentIndex - 2].cells[0].firstChild.firstChild.checked = true;
                return currentIndex;
            } else if (!isMoveUp && currentIndex < j - 1) {
                collection[currentIndex].cells[0].firstChild.firstChild.checked = false;
                collection[currentIndex + 2].cells[0].firstChild.firstChild.checked = true;
                return currentIndex
            }
        }
        return null;
    }

    private highlightCurrent(): void {
        let rows: any;
        rows = this.table.rows;
        for (let i = 0; i < rows.length; i++) {
            if (i === this.currentCell.row) {
                rows[i].classList.add('highlightedRow');
                for (let j = 0; j < rows[i].cells.length; j++) {
                    const cell = rows[i].cells[j];
                    if (j === this.currentCell.column) {
                        cell.classList.add('highlightedCell');
                    } else {
                        cell.classList.remove('highlightedCell');
                    }
                }
            } else {
                rows[i].classList.remove('highlightedRow');
                for (let j = 0; j < rows[i].cells.length; j++) {
                    const cell = rows[i].cells[j];
                    cell.classList.remove('highlightedCell');
                }
            }
        }
    }

    public setupMouseNavigation(table: HTMLTableElement): void {
        table.addEventListener('click', (event) => {
            let element: any = event.target;
            if (element.tagName === 'TD') {
                let rows: any;
                rows = this.table.rows;
                for (let i = 0; i < rows.length; i++) {
                    rows[i].classList.remove('highlightedRow');
                    for (let j = 0; j < rows[i].cells.length; j++) {
                        if (element === rows[i].cells[j]) {
                            rows[i].classList.add('highlightedRow');
                            element.classList.add('highlightedCell');
                            this.currentCell.row = i;
                            this.currentCell.column = j;
                        } else {
                            rows[i].cells[j].classList.remove('highlightedCell');

                        }
                    }
                }
            }
        }
        )
    }

    private setupKeyboardNavigation(): void {
        document.addEventListener('keydown', (event) => {

            switch (event.key) {
                case 'ArrowUp':
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
            }
        });
    }



    private isInputElement(row: number, column: number): void {
        let inputInCell = this.table.rows[row].cells[column].querySelector('input');
        if (inputInCell) {
            inputInCell.focus();
        }
    }

    private moveUp(): void {
        if (this.currentCell.row > 0) {
            this.currentCell.row--;
            this.isInputElement(this.currentCell.row, this.currentCell.column);
            this.highlightCurrent();
        }
    }


    private moveDown(): void {
        if (this.currentCell.row < this.table.rows.length - 1) {
            this.currentCell.row++;
            this.isInputElement(this.currentCell.row, this.currentCell.column);
            this.highlightCurrent();
        }
    }

    private moveLeft(): void {
        if (this.currentCell.column > 0) {
            this.currentCell.column--;
            this.isInputElement(this.currentCell.row, this.currentCell.column);
            this.highlightCurrent();
        }
    }

    private moveRight(): void {
        if (this.currentCell.column < this.table.rows[0].cells.length - 1) {
            this.currentCell.column++;
            this.isInputElement(this.currentCell.row, this.currentCell.column);
            this.highlightCurrent();
        }
    }
}