var loaicautraloi = {};
function chon_loai_cau_traloi(){
    document.getElementById('soluongluachon').value = '';
    document.getElementById('bodyNhapLuaChon').innerHTML = '';
    let select = document.getElementById('chon_loaicautraloi');
    let option = select.options[select.selectedIndex];

    const loai_cau_traloi = option.text;
    if (loai_cau_traloi == 'Trắc nghiệm'){
        loaicautraloi = {
            'loai_cau_tra_loi_id': 1
        };
        const html = `
            <th style="width: 50px">STT</th>
            <th>Nội dung lựa chọn</th>
        `;
        document.getElementById('headNhapLuaChon').innerHTML = html;
    } else if (loai_cau_traloi == 'Thang đo Likert') {
        loaicautraloi = {
            'loai_cau_tra_loi_id': 2
        };
        const html = `
            <th style="width: 50px">STT</th>
            <th style="width: 150px">Điểm Likert</th>
            <th>Nội dung</th>
        `;
        document.getElementById('headNhapLuaChon').innerHTML = html;
    };
};


function likert(soluongluachon) {
    let html = '';
    for (let i = 1; i <= soluongluachon; i++) {
        html += `
            <tr>
                <td style="vertical-align: middle">${i}</td>
                <td style="padding: 1px"><input class="form-control" type="number" placeholder=${i}></td>
                <td style="padding: 1px"><input class="form-control" type="text" placeholder="Nhập nội dung"></td>
            </tr>
        `;
    };
    document.getElementById('bodyNhapLuaChon').innerHTML = html;
};

function tracnghiem(soluongluachon) {
    let html = '';
    for (let i = 1; i <= soluongluachon; i++) {
        html += `
            <tr>
                <td style="vertical-align: middle">${i}</td>
                <td style="padding: 1px"><input class="form-control" type="text" placeholder="Nhập nội dung"></td>
            </tr>
        `;
    };
    document.getElementById('bodyNhapLuaChon').innerHTML = html;
};

function loai_traloi() {
    let soluongluachon = parseInt(document.getElementById('soluongluachon').value);
    if (loaicautraloi['loai_cau_tra_loi_id'] == 1) {
        tracnghiem(soluongluachon);
    } else if (loaicautraloi['loai_cau_tra_loi_id'] == 2) {
        likert(soluongluachon);
    };
};

