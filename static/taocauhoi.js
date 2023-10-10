$(document).ready(function () {
//change selectboxes to selectize mode to be searchable
   $("#chon_detai").select2();
});

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
            hiendanhsachcauhoi(response.cauhois);

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
            hienthibangnhomcauhoi(response.nhomcauhois);


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
        },
        error: function(error) {
            console.log(error);
        }
    });
};


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

function hiendanhsachcauhoi(cauhois){
    const numCauHoi = cauhois.length;
    let html = '';
    for (let i = 0; i < numCauHoi; i++) {
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${cauhois[i]['ma_cauhoi']}</td>
                <td>${cauhois[i]['noi_dung']}</td>
                <td>${cauhois[i]['trang_thai']}</td>
            </tr>
        `;
    }
    document.getElementById('bodyTableCauHoi').innerHTML = html;
};

function hienthibangnhomcauhoi(nhomcauhois) {
    let html = '';
    let i = 0;
    for (nhomcauhoi of nhomcauhois) {
        i++;
        html += `
            <tr>
                <td>${i}</td>
                <td>${nhomcauhoi['ma_nhom']}</td>
                <td>${nhomcauhoi['noi_dung']}</td>
            </tr>
        `;
    }
    document.getElementById('bodyTableNhomCauHoi').innerHTML = html;
};