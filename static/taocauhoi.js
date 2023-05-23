const columns1 = [
  { field: 'ID', hide: true},
  { field: 'Đề tài ID', hide: true },
  { field: 'Nhóm câu hỏi ID', hide: true },
  { field: 'Mã câu hỏi', width: 150, suppressSizeToFit: true },
  { field: 'Nội dung', wrapText: true, autoHeight: true}
];

const rows1 = [];
const gridOptions = {
    defaultColDef: {
        resizable: true,
    },
    columnDefs: columns1,
    rowData: rows1,
    defaultColDef: {sortable: true, filter: true},
    onFirstDataRendered: onFirstDataRendered,
    rowSelection: 'multiple', // allow rows to be selected
    animateRows: true, // have rows animate to new positions when sorted

    // example event handler
    onCellClicked: params => {
        console.log('cell was clicked', params.data)
     },
//         rowSelection: 'single',
//        onSelectionChanged: onSelectionChanged,
    };


const columns2 = [
  { field: 'ID', hide: true},
  { field: 'Đề tài ID', hide: true },
  { field: 'Nhóm câu hỏi ID', hide: true },
  { field: 'Mã câu hỏi', width: 150, suppressSizeToFit: true },
  { field: 'Nội dung', wrapText: true, autoHeight: true}
];


const rows2 = [];
const gridOptions2 = {
    defaultColDef: {
        resizable: true,
    },
    columnDefs: columns2,
    rowData: rows2,
    defaultColDef: {sortable: true, filter: true},
    onFirstDataRendered: onFirstDataRendered,
    rowSelection: 'multiple', // allow rows to be selected
    animateRows: true, // have rows animate to new positions when sorted

    // example event handler
    onCellClicked: params => {
        console.log('cell was clicked', params)
        return params
     },
    //         rowSelection: 'single',
    //        onSelectionChanged: onSelectionChanged,
};

const columnNhomCauHoi = [
  { field: 'ID', hide: true},
  { field: 'Đề tài ID', hide: true },
  { field: 'STT', width: 100 },
  { field: 'Mã nhóm', width: 150, suppressSizeToFit: true },
  { field: 'Tên nhóm', wrapText: true, autoHeight: true}
];

const rowNhomCauHoi = [];
const gridOptionsNhomCauHoi = {
    defaultColDef: {
        resizable: true,
    },
    columnDefs: columnNhomCauHoi,
    rowData: rowNhomCauHoi,
    defaultColDef: {sortable: true, filter: true},
    onFirstDataRendered: onFirstDataRendered,
    rowSelection: 'multiple', // allow rows to be selected
    animateRows: true, // have rows animate to new positions when sorted

    // example event handler
    onCellClicked: params => {
        console.log('cell was clicked', params)
        return params
     },
    //         rowSelection: 'single',
    //        onSelectionChanged: onSelectionChanged,
};




function onFirstDataRendered(params) {
  params.api.sizeColumnsToFit();
};

function chon_de_tai() {
    let select = document.getElementById('chon_detai');
    let option = select.options[select.selectedIndex];

    console.log(option.value);
    console.log(option.text);
    let data = {
        detai_id: option.value,
        ten_de_tai: option.text
    };
    sendData(data);
};

function chon_nhom_cauhoi(){
    let select = document.getElementById('chon_nhomcauhoi');
    let option = select.options[select.selectedIndex];

    console.log(option.value);
    console.log(option.text);
    ma_nhom = option.text.split("-")[0].trim();
    console.log(ma_nhom);
    let nhomcauhoi = {
        nhom_cauhoi_id: option.value,
        nhom_cauhoi: option.text,
        ma_nhom: ma_nhom
    };
    document.getElementById('ma_cauhoi').value = ma_nhom;
};

function sendData(data) {
    $.ajax({
        url: '/taocauhoi_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            const rows1 = [];
            const rows2 = [];
            const rowNhomCauHoi = [];
            console.log(response);
            console.log('Dữ liệu đã được gửi thành công');
            for (const cauhoi of response.cauhois){
                if (cauhoi['trang_thai'] === 'Hiện') {
                    rows1.push({
                        'ID': cauhoi['cauhoi_id'],
                        'Đề tài ID': cauhoi['detai_id'],
                        'Nhóm câu hỏi ID': cauhoi['nhom_cauhoi_id'],
                        'Mã câu hỏi': cauhoi['ma_cauhoi'],
                        'Nội dung': cauhoi['noi_dung']
                    });
                } else if (cauhoi['trang_thai'] === 'Ẩn') {
                    rows2.push({
                        'ID': cauhoi['cauhoi_id'],
                        'Đề tài ID': cauhoi['detai_id'],
                        'Nhóm câu hỏi ID': cauhoi['nhom_cauhoi_id'],
                        'Mã câu hỏi': cauhoi['ma_cauhoi'],
                        'Nội dung': cauhoi['noi_dung']
                    });
                };
            };
            var i = 1;

            const selectElement = document.getElementById('chon_nhomcauhoi');
            let html = '<option selected>Chọn nhóm câu hỏi...</option>';
            for (const nhomcauhoi of response.nhomcauhois){
                rowNhomCauHoi.push({
                    'ID': nhomcauhoi['nhom_cauhoi_id'],
                    'Đề tài ID': nhomcauhoi['detai_id'],
                    'STT': i,
                    'Mã nhóm': nhomcauhoi['ma_nhom'],
                    'Tên nhóm': nhomcauhoi['noi_dung'],
                });
                i = i + 1;
                html += '<option value=' + '"' + nhomcauhoi['nhom_cauhoi_id'] + '"' + '>' + nhomcauhoi['ma_nhom'] + ' - ' + nhomcauhoi['noi_dung'] + '</option>';
            };
            selectElement.innerHTML = html;

            gridOptions.api.setRowData(rows1);
            gridOptions2.api.setRowData(rows2);
            gridOptionsNhomCauHoi.api.setRowData(rowNhomCauHoi);
        },
        error: function(error) {
            console.log(error);
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});



document.addEventListener('DOMContentLoaded', () => {
  const gridDiv2 = document.querySelector('#myGrid2');
  new agGrid.Grid(gridDiv2, gridOptions2);
});

document.addEventListener('DOMContentLoaded', () => {
  const gridNhomCauHoi = document.querySelector('#gridNhomCauHoi');
  new agGrid.Grid(gridNhomCauHoi, gridOptionsNhomCauHoi);
});


