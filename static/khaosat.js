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

function sendData(data, action) {
    $.ajax({
        url: '/khaosat_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({data: data, action: action}),
        success: function(response) {
            console.log(response);
            console.log('Dữ liệu đã được gửi thành công');

            const cauhois = response.cauhois;
            const tracnghiems = response.tracnghiems;
            const likerts = response.likerts;

            let html = '';
            let stt = 1;
            for (cauhoi of cauhois){

                if (cauhoi['trang_thai'] == 'Hiện'){
                    html += '<p class="fw-medium" style="margin-bottom: 5px; color: #021538">' + stt + '. ' + cauhoi['noi_dung'] + '</p>';
                    stt ++;
                    for (tracnghiem of tracnghiems){
                        if (cauhoi['cauhoi_id'] == tracnghiem['cauhoi_id']){
                            for (luachon of tracnghiem['luachons']){
                                html += '<input class="form-check-input" name="' + stt + '" type="radio" value="' + luachon['noi_dung'] +'">'
                                html += '<label class="form-check-label" style="margin-left: 10px; margin-bottom: 5px">' + luachon['noi_dung'] + '</label><br>'
                            };
                        };
                    };
                    for (likert of likerts){
                        if (cauhoi['cauhoi_id'] == likert['cauhoi_id']){
                            for (diem_likert of likert['likerts']){
                                html += '<input class="form-check-input" name="' + stt + '" type="radio" value="' + diem_likert['noi_dung'] + '">'
                                html += '<label class="form-check-label" style="margin-left: 10px; margin-bottom: 5px">' + diem_likert['noi_dung'] + '</label><br>'
                            };
                        };
                    };
                };
            };
            document.getElementById('cauhoikhaosat').innerHTML = html;
        },
        error: function(error) {
            console.log(error);
        }
    });
};

