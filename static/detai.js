const data = [];
console.log(detais);

for (const detai of detais) {
  data.push({
    'ID': detai.detai_id,
    'Tên đề tài': detai.ten_de_tai,
    'Người thực hiện': detai.nguoi_thuc_hien ? detai.nguoi_thuc_hien.replace("'", "\\'") : '',
    'Ngày thực hiện': detai.ngay_thuc_hien,
    'Mô tả': detai.mo_ta ? detai.mo_ta.replace("'", "\\'") : '',
  });
}
hienThiDeTai(data);

function hienThiDeTai(data) {
    let html = '';
    let i = 0;
    const arr = ["ABCD", "WXYZ", "PQRS", "MNOP", "EFGH", "QRST", "UVWX", "JKLM", "IJKL", "BCDE"];
    for (detai of data) {
        var dateString = detai['Ngày thực hiện'];
        var dateObject = new Date(dateString);
        var month = dateObject.getUTCMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        var day = dateObject.getUTCDate();
        var year = dateObject.getUTCFullYear();
        var formattedDate = month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') + '-' + year.toString();

        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${arr[i]}</td>
                <td>${detai['Tên đề tài']}</td>
                <td>${detai['Người thực hiện']}</td>
                <td>${formattedDate}</td>
                <td>${detai['Mô tả']}</td>
            </tr>
        `;
        i++;
    };
    document.getElementById('bodyTableDeTai').innerHTML = html;
};


function luu_de_tai() {
    let ten_de_tai = document.getElementById('ten_de_tai').value;
    let nguoi_thuc_hien = document.getElementById('nguoi_thuc_hien').value;
    let ngay_thuc_hien = document.getElementById('ngay_thuc_hien').value;
    let mo_ta = document.getElementById('mo_ta').value;
    let detai = {
      'detai_id': 0,
      'ten_de_tai': ten_de_tai,
      'nguoi_thuc_hien': nguoi_thuc_hien,
      'ngay_thuc_hien': ngay_thuc_hien,
      'mo_ta': mo_ta
    };
    if (onSelectionChanged() !== null) {
        detai['detai_id'] = onSelectionChanged()['detai_id']
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

function sua_de_tai() {
    detai = onSelectionChanged();
    document.getElementById('ten_de_tai').value = detai.ten_de_tai;
    document.getElementById('nguoi_thuc_hien').value = detai.nguoi_thuc_hien;
    document.getElementById('ngay_thuc_hien').value = detai.ngay_thuc_hien;
    document.getElementById('mo_ta').value = detai.mo_ta;
}

function huy() {
    document.getElementById('ten_de_tai').value = '';
    document.getElementById('nguoi_thuc_hien').value = '';
    document.getElementById('ngay_thuc_hien').value = '';
    document.getElementById('mo_ta').value = '';
}