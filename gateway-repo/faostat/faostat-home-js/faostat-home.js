if (!window.FAOSTATHome) {

    window.FAOSTATHome = {

        /**
         * This map is used to avoid modules libraries to be loaded more than once.
         */
        loadUI : function(lang) {
            FAOSTATHome._labels();
            FAOSTATHome._loadNews('whatsNew-content', 'whatsNew', lang);
            FAOSTATHome._loadNews('comingUp-content', 'comingUp', lang);
            FAOSTATHome._loadLinks('partner-content', lang);
            FAOSTATHome._showBulkDownload();
        },

        _loadNews: function(id, type, lang) {
            var url = CORE.CONFIG.GATEWAY_REPO_URL + '/faostat/faostat-home-js/resources/' + type +'.json';
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

        _loadLinks: function(id, lang) {
            var url = CORE.CONFIG.GATEWAY_REPO_URL + '/faostat/faostat-home-js/resources/links.json';
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
            /** setting lang properties **/
           // CORE.getLangProperties();

            /* labels */
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

        _showBulkDownload: function() {
            $.ajax({
                type: 'GET',
                url: CORE.CONFIG.WDS_URL + '/rest/bulkdownloads/' + CORE.CONFIG.DATASOURCE + '/0/E',
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