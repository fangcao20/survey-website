
$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        console.log('hể');
        xulyfile();
        var formData = new FormData(this);
        $.ajax({
            method: "POST",
            url: 'phantich_data',
            data: formData,
            contentType: false,
            cache : false,
            processData: false
        });
    });
});

function hienthitenfile() {
    const file = document.getElementById("fileinput").files[0];
    document.getElementById("hienthitenfile").innerHTML = file.name;
    document.getElementById('submitfile').style.display = 'inline-block';
}

function xulyfile(){
    console.log("Xử lý file");
    document.getElementById('gridData').innerHTML = '';
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

        localStorage.setItem('data', JSON.stringify(jsonData));

        const numCol = jsonData[0].length;
        const nameCol =  jsonData[0];
        const columns = [{ field: 'STT', cellClass: 'stt-css' }];
        for (let i = 0; i < numCol; i++){
            columns.push(
                { field: nameCol[i].trim() }
            );
        };

        const rowDatas = [];
        const numRow = jsonData.length;
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
            defaultColDef: { resizable: true,},
            suppressMovableColumns: true,
            rowSelection: 'multiple', // allow rows to be selected
            animateRows: true, // have rows animate to new positions when sorted
            suppressColumnVirtualisation: true,

            // example event handler
            onCellClicked: params => {
                console.log('cell was clicked', params)
                return params
             },
//            rowSelection: 'single',
//            onSelectionChanged: onSelectionChanged,
        };

        function autoSizeAll(skipHeader) {
          const allColumnIds = [];
          gridOptionsData.columnApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
          });

          gridOptionsData.columnApi.autoSizeColumns(allColumnIds, skipHeader);
        };

        const gridData = document.getElementById('gridData');
        new agGrid.Grid(gridData, gridOptionsData);
        autoSizeAll(false);
         document.getElementById('gridData').style.display = 'block';
    };
    reader.readAsArrayBuffer(file);

};



$(document).ready(function () {
//change selectboxes to selectize mode to be searchable
   $("select").select2();
});

var dulieutudetai = 'false';
function tudetai() {
    document.getElementById('input_detai').style.display = "block";
    document.getElementById('input_dulieu').style.display = "none";
    document.getElementById('chonthoigian').style.display = "block";
    document.getElementById('gridData').style.display = 'none';
    dulieutudetai = 'false';
    localStorage.setItem('dulieutudetai', dulieutudetai);
};

function tuteptin() {
    document.getElementById('input_detai').style.display = "none";
    document.getElementById('input_dulieu').style.display = "block";
    document.getElementById('chonthoigian').style.display = "none";
    document.getElementById('button_phantich').style.display = "block";
    dulieutudetai = 'true';
    localStorage.setItem('dulieutudetai', dulieutudetai);
};



$(document).ready(function() {
  $('#danhgiathidiem').click(function() {
    $.ajax({
      url: '/danhgiathidiem',
      type: 'GET',
      success: function(response) {
        // Xử lý kết quả trả về nếu cần thiết
        window.open('/danhgiathidiem', '_blank');
      },
      error: function(error) {
        // Xử lý lỗi nếu có
        console.log(error);
      }
    });
  });
});

var dulieudetai = {};
function chon_de_tai() {
    let select = document.getElementById('chon_detai');
    let option = select.options[select.selectedIndex];

    console.log(option.value);
    console.log(option.text);
    detai_id = option.value;
    dulieudetai['detai_id'] = detai_id;
};

function thoigianbatdau() {
    let start = document.getElementById('batdau').value;
    dulieudetai['start'] = start;
};


function thoigianketthuc() {
    let end = document.getElementById('ketthuc').value;
    dulieudetai['end'] = end;
};

function hienthidulieudetai() {
    sendData(dulieudetai);
};

function sendData(data, action) {
    $.ajax({
        url: '/detai_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            let macauhois = response.macauhois;
            let cautralois = response.cautralois;
            if (action === 'xoa') {
                thuchienxoabien(tenbiens, macauhois, cautralois);

            } else if (action === 'hoantac') {
                alert(`Hoàn tác cột ${tenbiens[tenbiens.length-1]}`);
                tenbiens.pop();
                thuchienxoabien(tenbiens, macauhois, cautralois);
            };
            sendDatasauxoabienvahoantac(macauhois, cautralois);
            tabledulieudetai(macauhois, cautralois);
            document.getElementById('button_phantich').style.display = 'block';
            document.getElementById('gridData').style.display = 'none';
            localStorage.setItem('macauhois', JSON.stringify(macauhois));
            localStorage.setItem('cautralois', JSON.stringify(cautralois));
        },
        error: function(error) {
            console.log(error);
        }
    });
};

function tabledulieudetai(macauhois, cautralois) {
    let bienNum = macauhois.length;
    let head = '<th style="position: sticky; top: 0; background: white">STT</th>';
    for (macauhoi of macauhois) {
        head += `
            <th style="position: sticky; top: 0; background: white">${macauhoi}</th>
        `;
    };
    document.getElementById('headerdulieudetai').innerHTML = head;

    let body = '';
    let rowhtml = '';
    let numRow = Object.keys(cautralois).length;
    for (let row = 1; row <= numRow; row++){
        if (row in cautralois) {
            rowhtml = `<th scope="row">${row}</th>`;
            for (let i = 0; i < bienNum; i++){
                rowhtml += `<td>${cautralois[row][i]}</td>`;
            };
            body += `<tr>${rowhtml}</tr>`;
        };
    };
    document.getElementById('bodydulieudetai').innerHTML = body;
    choncot();
};

var tenbiens = [];
var bienvuaxoa;
function choncot() {
    $('th').on('click', function() {
        var $currentTable = $(this).closest('table');
        var index = $(this).index() - 1;
        $currentTable.find('td').removeClass('selected');
        $currentTable.find('th').removeClass('selected');
        $currentTable.find('th').eq(index+1).addClass('selected');
        $currentTable.find('tr').each(function() {
            $(this).find('td').eq(index).addClass('selected');
        });
        bienvuaxoa = $currentTable.find('th').eq(index+1).text();
        console.log(bienvuaxoa);
    });
};

function xoabien() {
    tenbiens.push(bienvuaxoa);
    console.log(tenbiens);
    sendData(dulieudetai,'xoa');
};

function hoantac() {
    sendData(dulieudetai, 'hoantac');
};

function sendDatasauxoabienvahoantac(macauhois, cautralois) {
    $.ajax({
        url: '/detai_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({macauhois: macauhois, cautralois: cautralois}),
        success: function(response) {
            console.log("ok");
        },
        error: function(error) {
            console.log(error);
        }
    });
};

function thuchienxoabien(tenbiens, macauhois, cautralois) {
    if (tenbiens.length > 0) {
        for (tenbien of tenbiens){
            index = macauhois.indexOf(tenbien);
            macauhois.splice(index, 1);
            for (let key in cautralois) {
                cautralois[key].splice(index, 1);
            };
        };
    };
};