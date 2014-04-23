if (!window.FAOSTATDatabaseUpdate) {

    window.FAOSTATDatabaseUpdate = {

        getDatabaseUpdates: function(db, lang) {

            // if lang is iso2 then get the FAOSTAT code
            if ( lang.length >= 2) lang = CORE.convertISO2toFAOSTATLang(lang)

            var q = {};
            q.query = "SELECT TOP 10 groupcode, groupname" + lang + ", domaincode, domainname" + lang + ", dateupdate " +
                      "FROM Domain " +
                      "ORDER BY dateupdate DESC ";
            var data = {};
            data.datasource = db,
            data.thousandSeparator = ',';
            data.decimalSeparator = '.';
            /** data.decimalNumbers = this.decimalValues; **/
            data.json = JSON.stringify(q);



            var _this = this;
            //console.log(data);
            $.ajax({
                type : 'POST',
                url :  CORE.CONFIG.WDS_URL + '/rest/table/json',
                data : data,
                success : function(response) {

                    if (typeof response == 'string')
                        response = $.parseJSON(response);


                   var html = '';
                    html += '<ul>';
                    for (var i = 0 ; i < response.length ; i++) {
                        var parts = response[i][4].match(/(\d+)/g);
                        var d = parts[0] + '-' + parts[1] + '-' + parts[2];
                        html += '<li id="update_' +response[i][2] +'" class="db-update-item"><b>'+ response[i][3] + "</b> " + d +' (' + response[i][1]  +')</li>';
                    }
                    html += '</ul>';
                    $("#database-updates").append(html);
                    for (var i = 0 ; i < response.length ; i++) {
                        var g = response[i][0];
                        var d =  response[i][2];
                        $("#update_" + response[i][2]).click({group: g, domain: d}, function(event) {
                           CORE.loadModule('download', event.data.group + '/' + event.data.domain);
                        });

                        $("#update_" + response[i][2]).attr('title', $.i18n.prop('_goToDownload'));
                        $("#update_" + response[i][2]).powerTip({placement: 'w'});
                    }
                },
                error : function(err, b, c) { }
            });
        }
    };
}	