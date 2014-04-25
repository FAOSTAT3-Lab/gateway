if (!window.FAOSTATHome) {

    window.FAOSTATHome = {

        init : function(gateway_repo_url, wds_url, datasource, lang) {
            FAOSTATHome._labels();
            FAOSTATHome._loadInterface(gateway_repo_url, datasource, lang);
            FAOSTATHome._loadNews(gateway_repo_url, 'whatsNew-content', 'whatsNew', lang);
            FAOSTATHome._loadNews(gateway_repo_url, 'comingUp-content', 'comingUp', lang);
            FAOSTATHome._loadLinks(gateway_repo_url, 'partner-content', lang);
            FAOSTATHome._showBulkDownload();
        },

        _loadInterface:function(gateway_repo_url, datasource, lang) {
            FAOSTATHomeCharts.createCharts(lang);
            FAOSTATDatabaseUpdate.getDatabaseUpdates(datasource, lang);

            /** load of the image TODO: make it dynamic**/
            document.getElementById("SPLASH").src = "" + gateway_repo_url +"/faostat/faostat-images/welcome_"+ lang +".gif";
            document.getElementById("release-calendar-img").src = ""+ gateway_repo_url +"/faostat/faostat-images/icons/calendar-ico.png";

            $("#release-calendar").click(function(){
                window.open("http://faostat3.fao.org/home/faostatReleaseCalendar.html", "_blank")
            });

           // FAOSTATHome.loadUI(CORE.CONFIG.LANG);

            document.getElementById('faostat-download-zip-download').innerHTML = $.i18n.prop('_downloadZip');
            document.getElementById('faostat-download-zip-database').innerHTML = $.i18n.prop('_database');
            document.getElementById('faostat-download-zip-click').innerHTML = $.i18n.prop('_withoneclick');
        },

        _loadNews: function(gateway_repo_url, id, type, lang) {
            var url = gateway_repo_url + '/faostat/faostat-home-js/resources/' + type +'.json';
            $.getJSON(url, function(data) {
                for( var i=0; i < data.length; i++) {
                    var html = '<div class="news-element">';
                    html += '<b>'+ data[i].title[lang] + '</b>';
                    html += '<p>' + data[i].description[lang] +'</p>';
                    html += '</div>';
                    $('#' + id).append(html);
                }
            });
        },

        _loadLinks: function(gateway_repo_url, id, lang) {
            var url = gateway_repo_url + '/faostat/faostat-home-js/resources/links.json';
            $.getJSON(url, function(data) {
                for( var i=0; i < data.length; i++) {
                    var html = '<div class="partner-link">';
                    html += '<b>'+ data[i].title[lang] + '</b>';
                    html += '<a href="' + data[i].link[lang] +'" target="_blank">'+ data[i].link[lang] +'</a>';
                    html += '</div>';
                    $('#' + id).append(html);
                }
            });

        },

        _labels: function() {

            // labels
            $('#whatsNewText').html($.i18n.prop('_whatsNew'));
            $('#databaseUpdatesText').html($.i18n.prop('_databaseUpdates'));
            $('#comingUpText').html($.i18n.prop('_comingUp'));
            $('#releaseCalendarText').html($.i18n.prop('_releaseCalendar'));
            $('#partners').html($.i18n.prop('_partners'));
            $('#faoLinks').html($.i18n.prop('_faoLinks'));

            $('#chart1Title').html($.i18n.prop('_chart1Title'));
            $('#chart1SubTitle').html($.i18n.prop('_chart1SubTitle'));
            $('#chart2Title').html($.i18n.prop('_chart2Title'));
            $('#chart2SubTitle').html($.i18n.prop('_chart2SubTitle'));
            $('#chart3Title').html($.i18n.prop('_chart3Title'));
            $('#chart3SubTitle').html($.i18n.prop('_chart3SubTitle'));

            /** tooltips **/
            $('#ifpri').attr("title", "International Food Policy Research Institute (IFPRI)");
            $("#ifpri").powerTip({placement: 's'});

            $('#ilo').attr("title","International Labour Organization (ILO)");
            $("#ilo").powerTip({placement: 's'});

            $('#oecd').attr("title","Organisation for Economic Co-operation and Development (OECD)");
            $("#oecd").powerTip({placement: 's'});

            $('#unfccc').attr("title","United Nations Framework Convention on Climate Change (UNFCC)");
            $("#unfccc").powerTip({placement: 's'});

            $('#unstats').attr("title","United Nations Statistics Division (UNSTATS)");
            $("#unstats").powerTip({placement: 's'});

            $('#usda').attr("title","United States Department of Agriculture (USDA)");
            $("#usda").powerTip({placement: 's'});

            $('worldbank').attr("title","World Bank" );
            $("#worldbank").powerTip({placement: 's'});

            $('#wto').attr("title", "World Trade Organization (WTO)");
            $("#wto").powerTip({placement: 's'});
        },

        _showBulkDownload: function(wds_url, datasource, lang) {
            $.ajax({
                type: 'GET',
                url: wds_url + '/rest/bulkdownloads/' + datasource + '/0/E',
                dataType: 'json',
                success: function (response) {
                    if (typeof response == 'string')
                        response = $.parseJSON(response);
                    document.getElementById('faostat-download-zip-date').innerHTML = response[0][4].substring(0, 10);
                },
                error: function (err, b, c) {
                }
            });

            $("#FAOSTAT-ZIP-Download").click(function(){
                window.open("ftp://ext-ftp.fao.org/ES/Reserved/essb/ess/ftp_essb/FAOSTAT/BulkDownloads/FAOSTAT.zip", "_blank");
                FAOSTAT_STATS.bulkDownloadZip();
            });
        }
    };

}