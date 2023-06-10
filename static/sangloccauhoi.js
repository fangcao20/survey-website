var macauhoichinhthucs = JSON.parse(localStorage.getItem('macauhois'));
var macauhoiloaibos = JSON.parse(localStorage.getItem('macauhoiloaibos'));
var data = {};
data['macauhoichinhthucs'] = macauhoichinhthucs;
data['macauhoiloaibos'] = macauhoiloaibos;
console.log(data);
sendData(data);

function sendData(data) {
    $.ajax({
        url: '/sangloc_data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {

        },
        error: function(error) {
            console.log(error);
        }
    });
};