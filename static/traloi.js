function chon_loai_cau_traloi(){
    let select = document.getElementById('chon_loaicautraloi');
    let option = select.options[select.selectedIndex];

    const loai_cau_traloi = option.text;
    console.log(loai_cau_traloi);
    document.getElementById('soluongluachon').value = '';
    if (loai_cau_traloi == 'Trắc nghiệm'){
        let loaicautraloi = {
            'loai_cau_tra_loi_id': 1
        };
        document.getElementById('nhapsoluongluachon').style.display = 'block';
        document.getElementById('gridTraLoi').style.display = 'block';
    } else {
        let loaicautraloi = {
            'loai_cau_tra_loi_id': 2
        };
        likert();
        document.getElementById('nhapsoluongluachon').style.display = 'block';
        document.getElementById('gridTraLoi').style.display = 'none';
        document.getElementById('gridLikert').style.display = 'block';

    };
};

const likert_columns = [
    { field: 'STT', width: 80, suppressSizeToFit: true },
    { field: 'Điểm Likert', width: 80 },
    { field: 'Nội dung', wrapText: true, autoHeight: true }
];

const likert_data = [];

const likert_gridOptions = {
    columnDefs: likert_columns,
    rowData: likert_data,
    defaultColDef: {
        editable: true,
    },
    onFirstDataRendered: onFirstDataRendered,
};

function likert() {
    const likert_data = [];
    const soluongluachon = document.getElementById('soluongluachon').value;
    if (soluongluachon == ''){
        for(let i = 1; i <= 5; i++){
            likert_data.push({
                'STT': i,
                'Điểm Likert': i,
                'Nội dung': ''
            });
        };
    };
    likert_gridOptions.api.setRowData(likert_data);

};


const traloi_columns = [
    { field: 'STT', width: 80, suppressSizeToFit: true },
    { field: 'Nội dung', wrapText: true, autoHeight: true },
];

const traloi_data = []

const traloi_gridOptions = {
        columnDefs: traloi_columns,
        rowData: traloi_data,
        defaultColDef: {
            editable: true,
        },
        onFirstDataRendered: onFirstDataRendered,
    };
function onFirstDataRendered(params) {
  params.api.sizeColumnsToFit();
};

function loai_traloi() {
    var soluongluachon = parseInt(document.getElementById('soluongluachon').value);
    console.log(soluongluachon);

    const traloi_data = [];
    for (var i = 1; i <= soluongluachon; i++) {
        traloi_data.push({
            'STT': i,
            'Nội dung': '',
        });
    };

    const likert_data = [];
    for(let i = 1; i<= soluongluachon; i++){
            likert_data.push({
                'STT': i,
                'Điểm Likert': i,
                'Nội dung': ''
            });
        };

    traloi_gridOptions.api.setRowData(traloi_data);
    likert_gridOptions.api.setRowData(likert_data);
};

document.addEventListener('DOMContentLoaded', function() {
        var traloi_gridDiv = document.querySelector('#gridTraLoi');
        new agGrid.Grid(traloi_gridDiv, traloi_gridOptions);
    });

document.addEventListener('DOMContentLoaded', function() {
        var likert_gridDiv = document.querySelector('#gridLikert');
        new agGrid.Grid(likert_gridDiv, likert_gridOptions);
    });


