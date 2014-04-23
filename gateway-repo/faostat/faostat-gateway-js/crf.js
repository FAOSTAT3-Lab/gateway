var CRF = (function() {

    var CONFIG = {
        prefix          :   'http://localhost:8080/faostat-download-js/',
        snippets        :   null,
        snippets_url    :   'crf/snippets.html',
        placeholder     :   'listArea',
        countries_url   :   'http://faostat3.fao.org/wds/rest/procedures/countries/faostat2/GT/E',
        years_url       :   'http://faostat3.fao.org/wds/rest/procedures/years/faostat2/GT'
    };

    function showCRF1996() {

    };

    function showCRF2006() {
        loadSnippets(buildUI);
    };

    function buildUI() {
        FAOSTATDownload.showDownloadOptionsAndButtons(false);
        document.getElementById('testinline').className = "invi";
        $('#mainTD').hide();
        $('#OLAPTD').show();
        document.getElementById(CRF.CONFIG.placeholder).innerHTML = CRF.CONFIG.snippets;
        populateCountries();
        populateYears();
    };

    function loadSnippets(callback) {

        /* Load the configuration file. */
        $.ajax({

            type        :   'GET',
            dataType    :   'text',
            url         :   CRF.CONFIG.prefix + CRF.CONFIG.snippets_url,

            /* Load data from the DB */
            success : function(response) {

                /* Convert the response in JSON, if needed */
                CRF.CONFIG.snippets = response;
                callback();

            },

            /* Use test data */
            error : function(err, b, c) {
                console.log(err + ', ' + b + ', ' + c);
            }

        });

    };

    function populateCountries() {
        $.ajax({
            type : 'GET',
            url : CRF.CONFIG.countries_url,
            success : function(response) {
                var json = response;
                if (typeof(json) == 'string')
                    json = $.parseJSON(response);
                var s = '<option value="null">Please select...</option>';
                for (var i = 0 ; i < json.length ; i++)
                    s += '<option value=' + json[i][0] + '>' + json[i][1] + '</option>';
                document.getElementById('countries').innerHTML = s;
                $('#countries').chosen();
            },
            error : function(err, b, c) {

            }
        });

    };

    function populateYears() {
        $.ajax({
            type : 'GET',
            url : CRF.CONFIG.years_url,
            success : function(response) {
                var json = response;
                if (typeof(json) == 'string')
                    json = $.parseJSON(response);
                var s = '<option value="null">Please select...</option>';
                for (var i = 0 ; i < json.length ; i++)
                    s += '<option value=' + json[i][0] + '>' + json[i][0] + '</option>';
                document.getElementById('years').innerHTML = s;
                $('#years').chosen();
            },
            error : function(err, b, c) {

            }
        });

    };

    function createCRF_G1() {
        var json = {};
        json.query = "SELECT D.areacode, D.year, D.itemcode, D.elementcode, D.value " +
                     "FROM DATA D " +
                     "WHERE D.domaincode IN ('GT', 'GM', 'GE', 'GR', 'GY', 'GU', 'GP', 'GA', 'GV', 'GB') " +
                     "AND D.areacode = '" + $('#countries').val() + "' " +
                     "AND D.itemcode IN ('1711', '1755', '27', '6795', '1712', '1709', '5058', '5059', '5060', '960', '5065', '5066') " +
                     "AND D.elementcode IN ('7244', '7243', '72254', '72256', '72306', '72255', '72259', '72309', '72307', '7231') " +
                     "AND D.year = " + $('#years').val() + "";
        var data = {};
        data.datasource = 'faostatproddiss';
        data.json = JSON.stringify(json);
        $.ajax({
            type : 'POST',
            url : 'http://faostat3.fao.org/wds/rest/table/json',
            data : data,
            success : function(response) {
                var json = response;
                if (typeof(json) == 'string')
                    json = $.parseJSON(response);
                for (var i = 0 ; i < json.length ; i++) {
                    try {
                        var id = json[i][2] + '_' + json[i][3];
                        document.getElementById(id).innerHTML = json[i][4];
                    } catch (err) {

                    }
                }
            },
            error : function(err, b, c) {

            }
        });
    };

    function createCRF_G2() {
        var json = {};
        json.query = "SELECT D.areacode, D.year, D.itemcode, D.elementcode, D.value " +
                     "FROM DATA D " +
                     "WHERE D.domaincode IN ('GF', 'GC', 'GL', 'GF', 'GG', 'GI') " +
                     "AND D.areacode = '" + $('#countries').val() + "' " +
                     "AND D.itemcode IN ('1707', '6751', '6797', '6727', '6726', '6750', '6796', '6728') " +
                     "AND D.elementcode IN ('7233', '72332', '719411', '72330', '719411', '72332', '719411', '72331') " +
                     "AND D.year = " + $('#years').val() + "";
        var data = {};
        data.datasource = 'faostatproddiss';
        data.json = JSON.stringify(json);
        $.ajax({
            type : 'POST',
            url : 'http://faostat3.fao.org/wds/rest/table/json',
            data : data,
            success : function(response) {
                var json = response;
                if (typeof(json) == 'string')
                    json = $.parseJSON(response);
                for (var i = 0 ; i < json.length ; i++) {
                    try {
                        var id = json[i][2] + '_' + json[i][3];
                        document.getElementById(id).innerHTML = json[i][4];
                    } catch (err) {

                    }
                }
                var sums = document.getElementsByClassName('sum');
                for (var i = 0 ; i < sums.length ; i++) {
                    var addends = sums[i].children;
                    var sum = 0;
                    var id = addends[addends.length - 1].id;
                    for (var j = 0 ; j < addends.length ; j++)
                        sum += (addends[j].innerHTML == '') ? 0 : parseFloat(addends[j].innerHTML);
//                    sums[i].innerHTML = sum;
                    document.getElementById(id).innerHTML = sum;
                }
            },
            error : function(err, b, c) {

            }
        });
    };

    function exportExcel(tableID) {
//        var s = document.getElementById(tableID).innerHTML;
//        s = s.replace(/\n|\t/g, '');
//        $('#' + tableID + '_DATA').val(JSON.stringify(s));
//        document[tableID + 'FORM'].submit();
        var addends = $('.addend');
        for (var i = 0 ; i < addends.length ; i++)
            addends[i].innerHTML = null;
        tableToExcel(tableID + "TABLE", "CRF " + tableID);
    };

    return {
        CONFIG          :   CONFIG,
        showCRF1996     :   showCRF1996,
        showCRF2006     :   showCRF2006,
        createCRF_G1    :   createCRF_G1,
        createCRF_G2    :   createCRF_G2,
        exportExcel     :   exportExcel
    };

})();
