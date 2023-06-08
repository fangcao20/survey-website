function xulyfile(){
    const file = document.getElementById("fileinput").files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Tiếp tục xử lý workbook tại đây
        // Ví dụ: lấy dữ liệu từ sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData);
        console.log('Hi');

        const numCol = jsonData[0].length;
        const nameCol = jsonData[0];
        const columns = [{ field: 'STT' }];
        for (let i = 0; i < numCol; i++){
            columns.push(
                { field: nameCol[i].trim() }
            );
        };

        const rowDatas = [];
        const numRow = jsonData.length;
        console.log(numRow);
        for (let row = 1; row < numRow; row++){
            const dictRow = {};
            dictRow['STT'] = row;
            for (let col = 0; col < numCol; col++){
                dictRow[nameCol[col].trim()] = jsonData[row][col];
            };
            rowDatas.push(dictRow);
        };

        const gridOptionsData = {
            columnDefs: columns,
            rowData: rowDatas,
            defaultColDef: {sortable: true, filter: true, resizable: true,},
            suppressMovableColumns: true,
            rowSelection: 'multiple', // allow rows to be selected
            animateRows: true, // have rows animate to new positions when sorted

            // example event handler
            onCellClicked: params => {
                console.log('cell was clicked', params)
                return params
             },
//            rowSelection: 'single',
//            onSelectionChanged: onSelectionChanged,
        };

        const gridData = document.getElementById('gridData');
        new agGrid.Grid(gridData, gridOptionsData);

    };
    reader.readAsArrayBuffer(file);
};

