const data = [];

for (const detai of detais) {
  data.push({
    'Tên đề tài': detai.ten_de_tai,
    'Người thực hiện': detai.nguoi_thuc_hien ? detai.nguoi_thuc_hien.replace("'", "\\'") : '',
    'Ngày thực hiện': detai.ngay_thuc_hien,
    'Mô tả': detai.mo_ta ? detai.mo_ta.replace("'", "\\'") : '',
  });
}

const columns = [
  { field: 'Tên đề tài' },
  { field: 'Người thực hiện' },
  { field: 'Ngày thực hiện' },
  { field: 'Mô tả' }
];

const gridOptions = {
    defaultColDef: {
        resizable: true,
    },
    columnDefs: columns,
    rowData: data,
    defaultColDef: {sortable: true, filter: true},
    rowSelection: 'multiple', // allow rows to be selected
    animateRows: true, // have rows animate to new positions when sorted

    // example event handler
    onCellClicked: params => {
        console.log('cell was clicked', params)
     },
     rowSelection: 'single',
    onSelectionChanged: onSelectionChanged,
    };

function onSelectionChanged() {
    const selectedRows = gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        console.log(selectedRows);
        let detai = {
          'ten_de_tai': selectedRows[0]['Tên đề tài'],
          'nguoi_thuc_hien': selectedRows[0]['Người thực hiện'],
          'ngay_thuc_hien': selectedRows[0]['Ngày thực hiện'],
          'mo_ta': selectedRows[0]['Mô tả']
        };
        return detai;
    };
};

function autoSizeAll(skipHeader) {
  const allColumnIds = [];
  gridOptions.columnApi.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });

  gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
};

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    autoSizeAll(false);
});


function luu_de_tai() {
    let ten_de_tai = document.getElementById('ten_de_tai').value;
    let nguoi_thuc_hien = document.getElementById('nguoi_thuc_hien').value;
    let ngay_thuc_hien = document.getElementById('ngay_thuc_hien').value;
    let mo_ta = document.getElementById('mo_ta').value;
    let detai = {
      'ten_de_tai': ten_de_tai,
      'nguoi_thuc_hien': nguoi_thuc_hien,
      'ngay_thuc_hien': ngay_thuc_hien,
      'mo_ta': mo_ta
    };
    sendData(detai, 'luu');
    };


function sendData(detai, action) {
    $.ajax({
      url: '/insert_detai',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ 'detai': detai, 'action': action }),
      success: function() {
        console.log(detai);
        location.reload();
      },
      error: function(error) {
        console.log(error);
      }
    });
    };


function xoa_de_tai() {
    detai = onSelectionChanged();
    sendData(detai, 'xoa');
    };