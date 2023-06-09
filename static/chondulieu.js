
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

var macauhoisfile1;
var cautraloisfile1;
var macauhoisfile2;
var cautraloisfile2;
function xulyfile(){
    console.log("Xử lý file");
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

        macauhoisfile1 = jsonData[0].slice();
        cautraloisfile1 = {};
        macauhoisfile2 = jsonData[0].slice();
        cautraloisfile2 = {};
        const numRow = jsonData.length;
        for (let row = 1; row < numRow; row++) {
            cautraloisfile1[row] = jsonData[row];
            cautraloisfile2[row] = jsonData[row];
        };
        tabledulieudetai(macauhoisfile1, cautraloisfile1);
        localStorage.setItem('macauhois', JSON.stringify(macauhoisfile1));
        localStorage.setItem('cautralois', JSON.stringify(cautraloisfile1));
        document.getElementById('button_phantich').style.display = 'block';
        sendDatasauxoabienvahoantac(macauhoisfile1, cautraloisfile1);
    };
    reader.readAsArrayBuffer(file);

};

$(document).ready(function () {
//change selectboxes to selectize mode to be searchable
   $("select").select2();
});

var dulieutudetai = 'true';
function tudetai() {
    document.getElementById('input_detai').style.display = "block";
    document.getElementById('input_dulieu').style.display = "none";
    document.getElementById('chonthoigian').style.display = "block";
    dulieutudetai = 'true';
    localStorage.setItem('dulieutudetai', dulieutudetai);
    document.querySelector('#tabledulieu').style.display = "none";
};

function tuteptin() {
    document.getElementById('input_detai').style.display = "none";
    document.getElementById('input_dulieu').style.display = "block";
    document.getElementById('chonthoigian').style.display = "none";
    dulieutudetai = 'false';
    localStorage.setItem('dulieutudetai', dulieutudetai);
    document.querySelector('#tabledulieu').style.display = "none";
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
                tenbiens.pop();
                thuchienxoabien(tenbiens, macauhois, cautralois);
            };
            sendDatasauxoabienvahoantac(macauhois, cautralois);
            tabledulieudetai(macauhois, cautralois);
            document.getElementById('button_phantich').style.display = 'block';
            localStorage.setItem('macauhois', JSON.stringify(macauhois));
            localStorage.setItem('cautralois', JSON.stringify(cautralois));
            localStorage.setItem('macauhoiloaibos', JSON.stringify(tenbiens));
        },
        error: function(error) {
            console.log(error);
        }
    });
};

function tabledulieudetai(macauhois, cautralois) {
    let bienNum = macauhois.length;
    let head = '<th style="position: sticky; top: 0; background: #eeeeee">STT</th>';
    for (macauhoi of macauhois) {
        head += `
            <th style="position: sticky; top: 0; background: #eeeeee">${macauhoi}</th>
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

    document.querySelector('#tabledulieu').style.display = "block";
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

$(document).ready(function() {
    $("#xoabien1").click(function(){
        tenbiens.push(bienvuaxoa);
        console.log(tenbiens);
        sendData(dulieudetai,'xoa');
    });
});

$(document).ready(function() {
    $("#hoantac1").click(function(){
        sendData(dulieudetai, 'hoantac');
    });
});

$(document).ready(function() {
    $("#hoantac2").click(function(){
        let macauhoisfile1 = macauhoisfile2.slice();
        let cautraloisfile1 = JSON.parse(JSON.stringify(cautraloisfile2));
        console.log(cautraloisfile1);

        console.log('tenbiens', tenbiens);
        tenbiens.pop();
        thuchienxoabien(tenbiens, macauhoisfile1, cautraloisfile1);
        tabledulieudetai(macauhoisfile1, cautraloisfile1);
        localStorage.setItem('macauhois', JSON.stringify(macauhoisfile1));
        localStorage.setItem('cautralois', JSON.stringify(cautraloisfile1));
        localStorage.setItem('macauhoiloaibos', JSON.stringify(tenbiens));
        sendDatasauxoabienvahoantac(macauhoisfile1, cautraloisfile1);
    });
});

$(document).ready(function() {
    $("#xoabien2").click(function(){
        let macauhoisfile1 = macauhoisfile2.slice();
        let cautraloisfile1 = JSON.parse(JSON.stringify(cautraloisfile2));
        console.log(cautraloisfile1);

        tenbiens.push(bienvuaxoa);
        thuchienxoabien(tenbiens, macauhoisfile1, cautraloisfile1);
        tabledulieudetai(macauhoisfile1, cautraloisfile1);
        localStorage.setItem('macauhois', JSON.stringify(macauhoisfile1));
        localStorage.setItem('cautralois', JSON.stringify(cautraloisfile1));
        localStorage.setItem('macauhoiloaibos', JSON.stringify(tenbiens));
        sendDatasauxoabienvahoantac(macauhoisfile1, cautraloisfile1);
    });
});


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