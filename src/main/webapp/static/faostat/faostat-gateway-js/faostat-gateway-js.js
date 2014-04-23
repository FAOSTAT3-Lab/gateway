if (!window.FAOSTATGateway) {

    window.FAOSTATGateway = {


        /**
         * This map is used to avoid modules libraries to be loaded more than once.
         */
        loadUI : function() {
            // fix to load async labels. TODO: make it nicer
            CORE.getLangProperties();
            //FAOSTATGateway._loadLabels();
            FAOSTATGateway._loadListeners();

            // Enable the feedback System
            FAOSTATGateway._loadFeedbackSystem('faostat-feedback-system');

            FAOSTATGateway._inizializeDD('faostat-feedback-system');

        },

        _loadListeners: function() {
            $("#searchFS").on("submit", function() {
                var q = document.getElementById('searchFStext').value;
                CORE.loadModule('search', q);
                return false;
            });
            // Reload of the modules in the different languages
            $("#langE").on("click", function() { CORE.reloadModule('E'); });
            $("#langF").on("click", function() { CORE.reloadModule('F'); });
            $("#langS").on("click", function() { CORE.reloadModule('S'); });
        },

        _loadLabels: function() {
            /** setting lang properties **/
                //CORE.getLangProperties();

            $('#home').html($.i18n.prop('_home'));
            $('#browse').html($.i18n.prop('_browse'));
            $('#download').html($.i18n.prop('_download'));
            $('#compare').html($.i18n.prop('_compare'));
            $('#search').html($.i18n.prop('_search'));
            $('#analysis').html($.i18n.prop('_analysis'));
            $('#mes').html($.i18n.prop('_mes'));

            /** labels **/
            $('.ico-pr').html($.i18n.prop('_production'));
            $('.ico-tr').html($.i18n.prop('_trade'));
            $('.ico-fs').html($.i18n.prop('_foodSupply'));
            $('.ico-re').html($.i18n.prop('_resources'));
            $('.ico-em').html($.i18n.prop('_ghg'));
            $('.ico-el').html($.i18n.prop('_ghgLandUse'));
            $('.ico-in').html($.i18n.prop('_investment'));
            $('.ico-fo').html($.i18n.prop('_forestry'));
            $('.ico-pi').html($.i18n.prop('_prices'));
            $('.ico-ae').html($.i18n.prop('_agriEnviromental'));
            $('.ico-fb').html($.i18n.prop('_foodBalanceSheet'));
            $('.ico-asti').html($.i18n.prop('_asti'));
            $('.ico-po').html($.i18n.prop('_population'));
            $('.ico-cb').html($.i18n.prop('_commoditybalances'));
        },

        _inizializeDD: function() {
            /** enable menu **/
            UIUtils.initializeDDMenu('browse', 'menu-dropdown-browse', 'menu-dropdown-download');
            UIUtils.initializeDDMenu('download', 'menu-dropdown-download', 'menu-dropdown-browse');
        },

        _loadFeedbackSystem: function(id) {
           // $("#" + id).fancybox();
        }

    };

}