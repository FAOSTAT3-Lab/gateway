if (!window.CORE) {

    window.CORE = {

        CONFIG : {
            DATASOURCE : "faostat2",

            // The base URL is used to load FAOSTAT gateway.
            GATEWAY_REPO_URL : 'http://localhost:8080/gateway-repo',

            // The base URL is used to load FAOSTAT REST URL (MODULES).
            GATEWAY_SERVICE_URL : 'http://localhost:8080/faostat',

            // The base WDS/BLETCHLEY URL is used to load FAOSTAT modules.
            WDS_URL       : 'http://faostat3.fao.org/wds',
            BLETCHLEY_URL : 'http://faostat3.fao.org/bletchley',

            LANG  : null,    // ISO2 langcode

            /*MODULE: null,   // i.e. ('home','download', 'browse') current module (set on base_index.html)
            SECTION: null,  // i.e. in browse: ('domain', 'area')
            CODE : null, // final code (i.e. 'Q','QC') */

            // used in search TODO: use CODE
            //WORD : null,

            /**
             * This map is used to avoid modules libraries to be loaded more than once.
             */
            loadMapJS : {
                'home' : false,
                'browse' : false,
                'download' : false,
                'compare' : false,
                'search' : false,
                'analysis' : false,
                'mes' : false
            },

            /**
             * This map is used to avoid modules CSS to be loaded more than once.
             */
            loadMapCSS : {
                'home' : false,
                'browse' : false,
                'download' : false,
                'compare' : false,
                'search' : false,
                'analysis' : false,
                'mes' : false
            }
        },

        CONFIG_MES: {
            prefix                  : 'http://168.202.28.214:8085/fenix-mes/',
            datasource              : 'faostat2',
            html_structure          : 'http://168.202.28.214:8085/fenix-mes/structure.html',
            rest_mes                : 'http://faostat3.fao.org/wds/rest/mes',
            rest_groupanddomains    : 'http://faostat3.fao.org/wds/rest/groupsanddomains',
            rest_domains            : 'http://faostat3.fao.org/wds/rest/domains'
        },

        /**
         * @param module        home, browse, download, compare, search, analysis, mes
         * @param config        config json for the method
         *                      {
         *                          "section": 'domain' (i.e. for browse)
         *                          "code"   : 'Q', 'QC' (i.e. in browse)
         *                      }
         */
        initModule : function(module, config) {
            console.log('CORE.initModule(): ' + module)
            console.log('CORE.initModule(): ' + module + " - " + config)
            // method to calculate DIV min height
            CORE.contentDIVMinHeight();

            // show the search bar
            $("#searchFS").show();


            // Store parameters
            if ( module ) CORE.CONFIG.MODULE = module; // to know which module is currently in use

            // TODO: alter config with DATASOURCE i.e. config.DATASOURCE to pass it to the specific module


            // Call the init method of the module
            switch (CORE.CONFIG.MODULE.toLowerCase()) {
                case 'home':    FAOSTATHome.init(CORE.CONFIG.GATEWAY_REPO_URL, CORE.CONFIG.WDS_URL, CORE.CONFIG.DATASOURCE, CORE.CONFIG.LANG); break;
                //case 'browse':  CORE.loadModuleLibs(module, function() { FAOSTATBrowse.init(CORE.CONFIG.GROUPCODE, CORE.CONFIG.DOMAINCODE, CORE.CONFIG.LANG) }); break;
                case 'browse':  CORE.loadModuleLibs(CORE.CONFIG.MODULE, function() { FAOSTATBrowse.init( config) }); break;

                case 'download':CORE.loadModuleLibs(CORE.CONFIG.MODULE, function() { FAOSTATDownload.init(CORE.CONFIG.GROUPCODE, CORE.CONFIG.DOMAINCODE, CORE.CONFIG.LANG) }); break;
                case 'compare': CORE.loadModuleLibs(CORE.CONFIG.MODULE, function() { FAOSTATCompare.init(CORE.CONFIG.GROUPCODE, CORE.CONFIG.DOMAINCODE, CORE.CONFIG.LANG) }); break;
                case 'analysis':CORE.loadModuleLibs(CORE.CONFIG.MODULE, function() { ANALYSIS.init(CORE.CONFIG.GROUPCODE, CORE.CONFIG.DOMAINCODE, CORE.CONFIG.LANG) }); break;
                case 'mes':
                    CORE.CONFIG_MES.sectionCode = CORE.CONFIG.SECTION;
                    CORE.CONFIG_MES.CODE = CORE.CONFIG.CODE;
                    //CORE.CONFIG_MES.subSectionCode =  config.SUBSECTION;
                    CORE.CONFIG_MES.lang = CORE.CONFIG.LANG;
                    CORE.loadModuleLibs(module, function() {
                        MES.init( CORE.CONFIG_MES )
                    });
                    break;
            }

        },

        /**
         * @param module        home, browse, download, compare, search, analysis, mes
         * @param word          it's the word search in faostat (i.e. Rice)
         * @param lang          UI language, e.g. 'E'
         */
        initModuleSearch : function(module, word, lang) {

            // method to calculate DIV min height
            CORE.contentDIVMinHeight();

            // Store parameters
            CORE.CONFIG.WORD = word;
            CORE.CONFIG.LANG = lang;

            // Call the init method of the module
            switch (module) {
                case 'search':  CORE.loadModuleLibs(module, function() { FAOSTATSearch.init(CORE.CONFIG.WORD, CORE.CONFIG.LANG)});
            }
        },




        /**
         * @returns {boolean} <code>true</code> if HTML5 is supported, <code>false</code> otherwise
         *
         * Check whether HTML5 is supported or not.
         */
        testHTML5 : function() {
            return history.pushState ? true : false;
        },

        /**
         * @param module 	home, browse, download, compare, search, analysis, mes
         * @param group		FAOSTAT group code, e.g. 'Q'
         * @param domain	FAOSTAT domain code, e.g. 'QC'
         * @param lang 		UI language, e.g. 'E'
         *
         * This function update the URL to allow the bookmark of the user's selection.
         */
        upgradeURL : function(module, group, domain, lang) {
            // TODO: TO CHANGE
            console.log('TODO: @DEPRECATED CORE.upgradeURL() needs to be changed')

            /** TODO: make is as load module **/
            /**if (CORE.testHTML5()) {
                window.history.pushState(null, '', '/' + module + '/' + group + '/' + domain + '/' + lang);
            } **/
        },

        stickSelectorsHeader : function() {
            $("#selectorsHead").sticky({topSpacing:0});
        },


        /**
         * @param module    The name of the module
         *
         * Each module has its own libraries, the full list is in the <code>libs.json</code> file.
         */
        loadModuleLibs : function(module, initFunction) {

            if (!CORE.CONFIG.loadMapJS[module]) {

                // Register the module
                CORE.CONFIG.loadMapJS[module] = true;

                // Load module's libraries.
                $.getJSON(CORE.CONFIG.GATEWAY_REPO_URL + '/faostat/faostat-gateway-js/libs.json', function (data) {

                    if(typeof data == 'string') data = $.parseJSON(data);
                    if ( data[module] )  {
                        var moduleLibs = data[module];
                        var requests = []
                        if ( moduleLibs.css ) {
                            for (var i = 0 ; i < moduleLibs.css.length ; i++) {
                                requests.push(moduleLibs.css[i]);
                            }
                        }
                        if ( moduleLibs.js ) {
                            for (var i = 0 ; i < moduleLibs.js.length ; i++) {
                                requests.push(moduleLibs.js[i]);
                            }
                        }
                        //ImportDependencies.importAsync(requests, initFunction);
                        ImportDependencies.importSequentially(requests, initFunction );
                    }
                    else{ initFunction(); }
                })

            } else {
                //console.log('JS libraries for module ' + module + ' won\'t be loaded again');
            }
        },

        breakLabel: function (lbl) {
            //var words = 3;
            var chars = 23;
            var c = 0;
            var index = 0;
            for (var i = 0 ; i < lbl.length ; i++) {
                if (lbl.charAt(i) == ' ') {
                    c++;
                    index = i;
                }
                if (i >= chars) {
                    // return lbl.substring(0, i) + '<br>' + lbl.substring(i);
                    return lbl.substring(0, index) + '<br>' + lbl.substring(index);
                }
            }
            return lbl;
        },

        breakLabelList: function (lbl, charsLength) {
            var chars = 23;
            if ( charsLength != null ) { chars = charsLength; }
            var c = 0;
            var index = 0;
            for (var i = 0 ; i < lbl.length ; i++) {
                if (lbl.charAt(i) == ' ') {
                    c++;
                    index = i;
                }
                if (i >= chars) {
                    // return lbl.substring(0, i) + '<br>' + lbl.substring(i);
                    return lbl.substring(0, index) + '<br>' + lbl.substring(index);
                }
            }
            return lbl;
        },

        replaceAll: function(text, stringToFind, stringToReplace) {
            var temp = text;
            var index = temp.indexOf(stringToFind);
            while(index != -1){
                temp = temp.replace(stringToFind,stringToReplace);
                index = temp.indexOf(stringToFind);
            }
            return temp;
        },

        getLangProperties: function(callback, module, config) {
            var I18NLang = CORE.CONFIG.LANG.toLowerCase();
            var path = CORE.CONFIG.GATEWAY_REPO_URL +'/faostat/I18N/';
            $.i18n.properties({
                name: 'I18N',
                path: path,
                mode: 'both',
                language: I18NLang,
                callback: function() {
                    callback(module, config)
                }
            });
        },

        reloadModule: function(lang) {
            alert('TODO: @DEPRECATED CORE.reloadModule() needs to be changed')
            /*console.log(CORE.CONFIG.LANG )
            var url = window.location.href;
            url = url.substring(0, url.length -2);
            url = url + '/' +  CORE.CONFIG.LANG;
            window.location.href = url;*/
        },

        /** TODO: to be completed **/
        loadModule: function(module, config) {

            var lang = (CORE.CONFIG.LANG.toLowerCase() == 'en')? '/' : CORE.CONFIG.LANG.toLowerCase();
            // TODO: move in in CORE.js
            var defaultURL =  CORE.CONFIG.GATEWAY_SERVICE_URL + lang + module + '/'+ config;
            var homeURL    =  CORE.CONFIG.GATEWAY_SERVICE_URL + lang + module + '/';
            var searchURL  =  CORE.CONFIG.GATEWAY_SERVICE_URL + lang + module + '/'+ config;

            switch (module) {
                case 'search':
                    window.location.href = searchURL;   break;
                case 'home':
                    window.location.href = homeURL;   break;
                default:
                    window.location.href = defaultURL;  break;
            }
        },

        loadSearchModule : function(module, word, lang) {
            window.location.href = CORE.CONFIG.GATEWAY_SERVICE_URL + '/' + module + '/' + word + '/' + lang;
        },

        contentDIVMinHeight: function() {
            var height = $(window).height() - (
                $("#headBg").outerHeight() +
                    $("#faostatMenu").outerHeight() +
                    + 85); // this is the footer height that is not calculated dynamically
            $("#container").css("min-height",height+"px");
        },

        convertISO2toFAOSTATLang: function(iso2lang) {
            switch (iso2lang.toUpperCase()) {
                case 'EN': return 'E';
                case 'FR': return 'F';
                case 'ES': return 'S';
                default:  return 'E';
            }
        }

    };

}
