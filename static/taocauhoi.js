const columns1 = [
  { field: 'ID', hide: true},
  { field: 'Đề tài ID', hide: true },
  { field: 'Nhóm câu hỏi ID', hide: true },
  { field: 'Loại câu trả lời ID', hide: true },
  { field: 'STT', width: 80, suppressSizeToFit: true },
  { field: 'Mã câu hỏi', width: 120, suppressSizeToFit: true },
  { field: 'Nội dung'}
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
    rowSelection: 'single',
    onSelectionChanged: onSelectionChangedCauHoi,
    };


const columns2 = [
  { field: 'ID', hide: true},
  { field: 'Đề tài ID', hide: true },
  { field: 'Nhóm câu hỏi ID', hide: true },
  { field: 'Loại câu trả lời ID', hide: true },
  { field: 'STT', width: 50 },
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
    rowSelection: 'single',
    onSelectionChanged: onSelectionChangedCauHoi,
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
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged,
};


function onSelectionChanged() {
    const selectedRows = gridOptionsNhomCauHoi.api.getSelectedRows();
    if (selectedRows.length > 0) {
        console.log(selectedRows);
        let nhomcauhoi = {
          'detai_id': selectedRows[0]['Đề tài ID'],
          'nhom_cauhoi_id': selectedRows[0]['ID'],
          'ma_nhom': selectedRows[0]['Mã nhóm'],
          'ten_nhom': selectedRows[0]['Tên nhóm'],
        };
        return nhomcauhoi;
    };
    return null;
};

function onSelectionChangedCauHoi() {
    const selectedRows = gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        console.log(selectedRows);
        let cauhoi = {
          'detai_id': selectedRows[0]['Đề tài ID'],
          'cauhoi_id': selectedRows[0]['ID'],
          'nhom_cauhoi_id': selectedRows[0]['Nhóm câu hỏi ID'],
          'loai_cau_tra_loi_id': selectedRows[0]['Loại câu trả lời ID'],
          'ma_cauhoi': selectedRows[0]['Mã câu hỏi'],
          'noi_dung': selectedRows[0]['Nội dung'],
        };
        let traloi_data = [];
        let i = 1;
        for (const tracnghiem of tracnghiems){
            if (tracnghiem['cauhoi_id'] == cauhoi['cauhoi_id']){
                traloi_data.push({
                    'STT': i,
                    'Nội dung': tracnghiem['noi_dung']
                });
                i += 1;
            };
        };

        let likert_data = [];
        for (const likert of likerts){
            if (likert['cauhoi_id'] == cauhoi['cauhoi_id']){
                likert_data.push({
                    'STT': i,
                    'Điểm Likert': likert['diem_likert'],
                    'Nội dung': likert['noi_dung'],
                });
                i++
            };
        };

        if (cauhoi['loai_cau_tra_loi_id'] == 1){
            traloi_gridOptions.api.setRowData(traloi_data);
            document.getElementById('chon_loaicautraloi').value = 'Trắc nghiệm';
            document.getElementById('gridTraLoi').style.display = 'block';
            document.getElementById('gridLikert').style.display = 'none';
        } else if (cauhoi['loai_cau_tra_loi_id'] == 2){
            likert_gridOptions.api.setRowData(likert_data);
            document.getElementById('chon_loaicautraloi').value = 'Thang đo Likert';
            document.getElementById('gridLikert').style.display = 'block';
            document.getElementById('gridTraLoi').style.display = 'none';
        };
        document.getElementById('nhapsoluongluachon').style.display = 'block';
        document.getElementById('soluongluachon').value = i - 1;
        document.getElementById('ma_cauhoi').value = cauhoi['ma_cauhoi'];
        document.getElementById('noidung_cauhoi').value = cauhoi['noi_dung'];
        console.log('Here');
        console.log(traloi_data);
        console.log(likert_data);
        console.log(cauhoi);
        return cauhoi;
    };
    return null;
};


function onFirstDataRendered(params) {
  params.api.sizeColumnsToFit();
};

function autoSizeAll(skipHeader) {
  const allColumnIds = [];
  gridOptions.columnApi.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });

  gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
}

var detai_id;
function chon_de_tai() {
    let select = document.getElementById('chon_detai');
    let option = select.options[select.selectedIndex];

    console.log(option.value);
    console.log(option.text);
    let data = {
        detai_id: option.value,
        ten_de_tai: option.text
    };
    sendData(data,"");
    detai_id = option.value;
};

var nhom_cauhoi_id;
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
    nhom_cauhoi_id = option.value;
};

var likerts = [];
var tracnghiems = [];
function sendData(data, action) {
    $.ajax({
        url: '/taocauhoi_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({data: data, action: action}),
        success: function(response) {
            const rows1 = [];
            const rows2 = [];
            const rowNhomCauHoi = [];
            console.log(response);
            console.log('Dữ liệu đã được gửi thành công');
            var stt_cauhoi_hien = 1;
            var stt_cauhoi_an = 1;
            for (const cauhoi of response.cauhois){
                if (cauhoi['trang_thai'] === 'Hiện') {
                    rows1.push({
                        'ID': cauhoi['cauhoi_id'],
                        'Đề tài ID': cauhoi['detai_id'],
                        'Nhóm câu hỏi ID': cauhoi['nhom_cauhoi_id'],
                        'Loại câu trả lời ID': cauhoi['loai_cau_tra_loi_id'],
                        'STT': stt_cauhoi_hien,
                        'Mã câu hỏi': cauhoi['ma_cauhoi'],
                        'Nội dung': cauhoi['noi_dung']
                    });
                    stt_cauhoi_hien += 1;
                } else if (cauhoi['trang_thai'] === 'Ẩn') {
                    rows2.push({
                        'ID': cauhoi['cauhoi_id'],
                        'Đề tài ID': cauhoi['detai_id'],
                        'Nhóm câu hỏi ID': cauhoi['nhom_cauhoi_id'],
                        'Loại câu trả lời ID': cauhoi['loai_cau_tra_loi_id'],
                        'STT': stt_cauhoi_an,
                        'Mã câu hỏi': cauhoi['ma_cauhoi'],
                        'Nội dung': cauhoi['noi_dung']
                    });
                    stt_cauhoi_an += 1;
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


            for (const tracnghiem of response.tracnghiems){
                if (tracnghiem['luachons'].length != 0){
                    for (const luachon of tracnghiem['luachons']){
                       tracnghiems.push({
                            'cauhoi_id': luachon['cauhoi_id'],
                            'luachon_id': luachon['luachon_id'],
                            'noi_dung': luachon['noi_dung']
                       });
                    };
                };
            };



            for (const diem_likert of response.likerts){
                if (diem_likert['likerts'].length != 0){
                    for (const likert of diem_likert['likerts']){
                        likerts.push({
                            'cauhoi_id': likert['cauhoi_id'],
                            'likert_id': likert['likert_id'],
                            'diem_likert': likert['diem_likert'],
                            'noi_dung': likert['noi_dung']
                        });
                    };
                };
            };

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


var suacauhoi_button_clicked = false;
function luu_cauhoi() {
  let ma_cauhoi = document.getElementById('ma_cauhoi').value;
  let noidung_cauhoi = document.getElementById('noidung_cauhoi').value;
  let loai_cau_tra_loi = document.getElementById('chon_loaicautraloi').value;
  var cautraloi = [];
  var loai_cau_tra_loi_id = 0;

  if (loai_cau_tra_loi == 'Trắc nghiệm'){
    loai_cau_tra_loi_id = 1;
    traloi_gridOptions.api.forEachNode(function(node){
        cautraloi.push({
            'STT': node.data['STT'],
            'Nội dung': node.data['Nội dung'],
            'luachon_id': 0
        });
      });
  } else if (loai_cau_tra_loi == 'Thang đo Likert'){
    loai_cau_tra_loi_id = 2;
    likert_gridOptions.api.forEachNode(function(node){
        cautraloi.push({
            'STT': node.data['STT'],
            'Điểm Likert': node.data['Điểm Likert'],
            'Nội dung': node.data['Nội dung'],
            'likert_id': 0
        });
      });
  };
  let cauhoi = {
    'detai_id': detai_id,
    'nhom_cauhoi_id': nhom_cauhoi_id,
    'cauhoi_id': 0,
    'loai_cau_tra_loi_id': loai_cau_tra_loi_id,
    'ma_cauhoi': ma_cauhoi,
    'noi_dung': noidung_cauhoi,
    'cautraloi': cautraloi,
  };

  if (suacauhoi_button_clicked == true){
    if (onSelectionChangedCauHoi() !== null) {
        cauhoi['cauhoi_id'] = onSelectionChangedCauHoi()['cauhoi_id']
        cauhoi['nhom_cauhoi_id'] = onSelectionChangedCauHoi['nhom_cauhoi_id'];
        suacauhoi_button_clicked = false;
        console.log(cauhoi['cauhoi_id']);
        console.log(cauhoi['nhom_cauhoi_id']);
    };
  };
  console.log('Hi');
  console.log(cauhoi);
  sendData(cauhoi, 'luu_cauhoi');
  document.getElementById('ma_cauhoi').value = '';
  document.getElementById('noidung_cauhoi').value = '';
  document.getElementById('chon_loaicautraloi').value = '';
  };


function xoa_cauhoi() {
  let cauhoi = onSelectionChangedCauHoi();
  sendData(cauhoi, 'xoa_cauhoi');
  };

function sua_cauhoi() {
  let cauhoi = onSelectionChangedCauHoi();
  suacauhoi_button_clicked = true;
  document.getElementById('ma_cauhoi').value = cauhoi['ma_cauhoi'];
  document.getElementById('noidung_cauhoi').value = cauhoi['noi_dung'];
}

function huy_cauhoi() {
  document.getElementById('ma_cauhoi').value = '';
  document.getElementById('noidung_cauhoi').value = '';
}