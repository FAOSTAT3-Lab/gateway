if (!window.FAOSTAT_STATS) {

    window.FAOSTAT_STATS = {

        /**
         * @param category  VISUALIZE, VISUALIZE_BY_DOMAIN, VISUALIZE_BY_AREA, VISUALIZE_TOP_20
         * @param action    Access to ...
         * @param label     Group Code, countries_by_commodity, commodities_by_regions
         */
        track : function(category, action, label) {
            _gaq.push(['_trackEvent', category, action, label]);
        },

        bulkDownloadZip : function() {
            FAOSTAT_STATS.track('DOWNLOAD_FAOSTAT_ZIP', 'HOMEPAGE', 'DOWNLOAD_FAOSTAT_ZIP');
        }
    };

}