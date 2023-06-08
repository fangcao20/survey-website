var macauhois = JSON.parse(localStorage.getItem('macauhois'));
var cautralois = JSON.parse(localStorage.getItem('cautralois'));
var tennhom = Array.from(new Set(macauhois.map(col => col.match(/[a-zA-Z]+/)[0])));

var dataDict  = [];

for (const key in cautralois) {
  const values = cautralois[key];
  const new_dict = {};
  for (let i = 0; i < macauhois.length; i++) {
    new_dict[macauhois[i]] = values[i];
  };
  dataDict.push(new_dict);
};
console.log(dataDict);
    sendData(dataDict, '');

let html = '<option value="">Chọn nhóm câu hỏi</option>';
for (nhom of tennhom){
    html += '<option value="' + nhom + '">' + nhom + '</option>';
};

$(document).ready(function () {
//change selectboxes to selectize mode to be searchable
   $("select").select2();
});

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('chonnhomcauhoi').innerHTML = html;
});

function nhantokhampha(){
    let link = document.getElementById('efa');
    link.classList.add('active');
    link.setAttribute("aria-current", "page");
    link = document.getElementById('cronbachalpha');
    if (link.classList.contains('active')) {
        link.classList.remove('active');
        link.removeAttribute("aria-current");
    }
    document.getElementById('hienthicronbach').style.display = 'none';
    document.getElementById('hienthiefa').style.display = 'block';
};

function cronbach(){
    let link = document.getElementById('cronbachalpha');
    link.classList.add('active');
    link.setAttribute("aria-current", "page");
    link = document.getElementById('efa');
    if (link.classList.contains('active')) {
        link.classList.remove('active');
        link.removeAttribute("aria-current");
    };
    document.getElementById('hienthicronbach').style.display = 'block';
    document.getElementById('hienthiefa').style.display = 'none';
};


function hienthi_cronbach(table){
    document.getElementById('cronbachGrid').innerHTML = '';
    const columns = [{ field: 'STT', cellClass: 'stt-css' }];
    for (col of table['columns']){
        columns.push(
            { field: col.trim() }
        );
    };

    const rows = [];
    const keys = Object.keys(table);
    const numCol = table['columns'].length;
    for (let row = 1; row <= keys.length - 1; row++ ){
        const dictRow = {};
        dictRow['STT'] = row;
        for (let col = 0; col < numCol; col++){
            let value = table[row][col];
            if (!isNaN(value)) {
                value = parseFloat(value).toFixed(3);
            };
            dictRow[table['columns'][col]] = value;
        };
        rows.push(dictRow);
    };

    const gridOptionsCronbach = {
        columnDefs: columns,
        rowData: rows,
        defaultColDef: { resizable: true,},
        suppressMovableColumns: true,
        rowSelection: 'multiple', // allow rows to be selected
        animateRows: true, // have rows animate to new positions when sorted
        suppressColumnVirtualisation: true,

        onCellClicked: params => {
            console.log('cell was clicked', params)
            return params
         },
    };

    function autoSizeAll(skipHeader) {
      const allColumnIds = [];
      gridOptionsCronbach.columnApi.getColumns().forEach((column) => {
        allColumnIds.push(column.getId());
      });

      gridOptionsCronbach.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    };

    function setAutoHeight() {
      gridOptionsCronbach.api.setDomLayout('autoHeight');
      document.querySelector('#cronbachGrid').style.height = '';
    };

    const gridDataCronbach = document.getElementById('cronbachGrid');
    new agGrid.Grid(gridDataCronbach, gridOptionsCronbach);
    autoSizeAll(false);
    setAutoHeight();
    if (parseInt(document.querySelector('#cronbachGrid').offsetHeight) >= 500) {
      gridOptionsCronbach.api.setDomLayout('normal');
      document.querySelector('#cronbachGrid').style.height = '500px';
    };



    gridOptionsCronbach.getRowStyle = params => {
        let check = false;
        gridOptionsCronbach.api.forEachNode(function (node) {
          var value = node.data['Tương quan biến tổng'];
          if (parseFloat(value) < 0.3) {
            if (params.node.id === node.id) {
                check = true;
            };
          };
        });
        if (check) {
            return {background: '#ffe5ea', color: '#d64b4b'};
        };
    };

    document.getElementById('cronbachGrid').innerHTML = '';
    new agGrid.Grid(gridDataCronbach, gridOptionsCronbach);
    autoSizeAll(false);
    setAutoHeight();
    if (parseInt(document.querySelector('#cronbachGrid').offsetHeight) >= 500) {
      gridOptionsCronbach.api.setDomLayout('normal');
      document.querySelector('#cronbachGrid').style.height = '500px';
    };
};

function sendData(data, nhomcauhoi) {
    $.ajax({
        url: '/phantich_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({data: data, nhomcauhoi: nhomcauhoi}),
        success: function(response) {
            console.log(response.cronbach_total);
            console.log(response.cronbach_table);
            cronbachalalpha = response.cronbach_total.toFixed(3);
            document.getElementById('crbalpha').innerHTML = cronbachalalpha;
            if (cronbachalalpha < 0.7){
                document.getElementById('crbalpha').style.backgroundColor = '#ffe5ea';
                document.getElementById('crbalpha').style.color = '#d64b4b';
            };

            document.getElementById('comau').innerHTML = response.comau;
            document.getElementById('soluongbien').innerHTML = response.soluongbien;
            hienthi_cronbach(response.cronbach_table);

            let p_value = parseFloat(response.p_value).toFixed(3);
            let kmo = parseFloat(response.kmo).toFixed(3);
            document.getElementById('kmo').innerHTML = kmo;
            document.getElementById('bartlett').innerHTML = p_value;

            let ev = response.ev;
            let binhphuong = response.binhphuong;
            let tile = response.tile;
            let tichluy = response.tichluy;
            let factorNum = binhphuong.length;
            console.log(factorNum);
            let html = '';
            for (let factor = 0; factor < factorNum - 1; factor++) {
                html += `
                    <tr>
                        <th scope="row">${factor + 1}</th>
                        <td>${parseFloat(ev[factor]).toFixed(3)}</td>
                        <td>${parseFloat(binhphuong[factor]).toFixed(3)}</td>
                        <td>${parseFloat(tile[factor]).toFixed(3)}</td>
                        <td>${parseFloat(tichluy[factor]).toFixed(3)}</td>
                    </tr>
                `;

            };
            factor = factorNum - 1;
            html += `
                <tr>
                    <th scope="row">${factor + 1}</th>
                    <td style="color: #d64b4b; background: #fff2cc;">${parseFloat(ev[factor]).toFixed(3)}</td>
                    <td>${parseFloat(binhphuong[factor]).toFixed(3)}</td>
                    <td>${parseFloat(tile[factor]).toFixed(3)}</td>
                    <td style="color: #d64b4b; background: #fff2cc;">${parseFloat(tichluy[factor]).toFixed(3)}</td>
                </tr>
            `;
            html += `
                <tr>
                    <th scope="row">${ev.length}</th>
                    <td>${parseFloat(ev[ev.length - 1]).toFixed(3)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;
            document.getElementById('bodyphuongsai').innerHTML = html;
            hienthimatranxoay(response.matran, factorNum);
        },
        error: function(error) {
            console.log(error);
        }
    });
};

function chon_nhom(){
    let select = document.getElementById('chonnhomcauhoi');
    let option = select.options[select.selectedIndex];
    nhomcauhoi = option.text;
    if (nhomcauhoi === 'Chọn nhóm câu hỏi'){
        nhomcauhoi = '';
    };
    sendData(dataDict, nhomcauhoi);
};

function hienthimatranxoay(matran, factorNum){
    let numRow = Object.keys(matran).length;
    let head = '<th style="position: sticky; top: 0; background: white"></th>';
    for (let factor = 1; factor <= factorNum; factor++){
        head += `<th style="position: sticky; top: 0; background: white">Nhân tố ${factor}</th>`
    };
    document.getElementById('headmatranxoay').innerHTML = head;

    let body = '';
    let rowhtml = '';
    for (let row = 1; row <= numRow; row++){
        rowhtml = `<th scope="row">${matran[row][0]}</th>`;
        for (let factor = 1; factor <= factorNum; factor++){
            if (parseFloat(matran[row][factor]) > 0.5){
                rowhtml += `<td style="color: #d64b4b; background: #fff2cc;">${parseFloat(matran[row][factor]).toFixed(3)}</td>`;
            } else {
                rowhtml += `<td>${parseFloat(matran[row][factor]).toFixed(3)}</td>`;
            };
        };
        body += `<tr>${rowhtml}</tr>`;
    };
    document.getElementById('bodymatranxoay').innerHTML = body;
};