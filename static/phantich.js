//function hien_thi_data() {
//    $.ajax({
//      url: '/phantich_data',
//      type: 'POST',
//      contentType: 'application/json',
//      success: function(response) {
//        console.log(0)
//        console.log(response.data);
////        hienthi(data[0], data[1])
//        location.reload();
//      },
//      error: function(error) {
//        console.log(error);
//      }
//    });
//}


//
//  const columns = [];
//  for (let i = 0; i < cols.length; i++) {
//    columns.push({
//      field: cols[i],
//    });
//  }
//
//  const gridOptions = {
//    defaultColDef: {
//      resizable: true,
//    },
//    columnDefs: columns,
//    rowData: rows,
//    defaultColDef: {sortable: true, filter: true},
//    rowSelection: 'multiple', // allow rows to be selected
//    animateRows: true, // have rows animate to new positions when sorted
//
//    // example event handler
//    onCellClicked: params => {
//      console.log('cell was clicked', params);
//    },
//  };
//
//  document.addEventListener('DOMContentLoaded', () => {
//    const gridDiv = document.querySelector('#myGrid');
//    new agGrid.Grid(gridDiv, gridOptions);
//    autoSizeAll(false);
//  });
//
