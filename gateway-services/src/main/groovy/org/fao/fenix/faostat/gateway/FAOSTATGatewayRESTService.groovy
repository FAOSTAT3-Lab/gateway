/**
 *
 * FENIX (Food security and Early warning Network and Information Exchange)
 *
 * Copyright (c) 2011, by FAO of UN under the EC-FAO Food Security
 Information for Action Programme
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
package org.fao.fenix.faostat.gateway

import com.google.gson.Gson

import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.PathParam
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType
import org.fao.fenix.faostat.gateway.*;

/**
 * @author <a href="mailto:guido.barbaglia@fao.org">Guido Barbaglia</a>
 * @author <a href="mailto:guido.barbaglia@gmail.com">Guido Barbaglia</a>
 * */
@Path("")
class FAOSTATGatewayRESTService {

    // DEFAULT config file and language
    def CONFIG_FILE = 'config/faostat/config.json'
    def DEFAULT_LANGUAGE = 'EN'

    // Variables to change on HTML files
    def $_GATEWAY_REPO_BASE_URL = '$_GATEWAY_REPO_BASE_URL'
    def $_MODULES_BASE_URL = '$_MODULES_BASE_URL'
    def $_CONTENT = '$_CONTENT' // placeholder in the HTML to change the HTML module
    def $_ISO2_LANG = '$_ISO2_LANG'
    def $_FAOSTAT_LANG = '$_FAOSTAT_LANG'
    def $_CODE = '$_CODE' // code for group/domain etc
    def $_MODULE_CODE = '$_MODULE_CODE'
    def $MODULE_CONFIG = '$MODULE_CONFIG'

    // search
    def $_WORD = '$_WORD'
    def $_DISPLAY_SEARCH = '$_DISPLAY_SEARCH'


    /**
     * @param module    FAOSTAT module: home
     * @param lang      EN, FR or ES
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("home")
    public String loadModuleHomeDefault() { return loadModuleHome(DEFAULT_LANGUAGE) }

    /**
    /**
     * @param module   FAOSTAT module: home
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("{lang}/home")
    public String loadModuleHomeLang(@PathParam("lang") String lang) { return loadModuleHome(lang) }

    private String loadModuleHome(lang) {
        return replaceHtml(readConfigFile(), 'faostat-home-js', 'home', lang);
    }

    /*************************************************************
     *
     * BROWSE
     *
     ***************************************************************/


    //TODO: a default view also for /browse?
    /*@GET
    @Produces(MediaType.TEXT_HTML)
    @Path("browse")
    public String loadBrowseDefault() {
        loadBrowse(DEFAULT_LANGUAGE, 'domain', null)
    }


    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("{lang}/browse")
    public String loadLangBrowseDefault(@PathParam("lang") String lang) {
        loadBrowse(lang, 'domain', null)
    } */

    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("{lang}/browse/{section}")
    public String loadLangBrowseSection(@PathParam("lang") String lang, @PathParam("section") String section) {
        loadBrowse(lang, section, null)
    }

    // TODO: needed?
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("browse/{section}")
    public String loadBrowseSection(@PathParam("section") String section) {
        loadBrowse(DEFAULT_LANGUAGE, section, null)
    }

    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("/browse/{section}/{code}")
    public String loadBrowseSectionCode(@PathParam("section") String section, @PathParam("code") String code) {
        loadBrowse(DEFAULT_LANGUAGE, section, code)
    }

    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("{lang}/browse/{section}/{code}")
    public String loadBrowseSectionCodeLang(@PathParam("lang") String lang, @PathParam("section") String section, @PathParam("code") String code) {
        loadBrowse(lang, section, code)
    }

   private String loadBrowse(String lang, String section, String code) {
       println('------------')
       println(lang)
       println(section)
       println(code)

       HashMap<String, String> configMap = readConfigFile();
       String main = replaceHtml(configMap, 'faostat-browse-js', 'browse', lang);

       // config module (TODO: make it in json)
       def config = '{ "SECTION" : "' + section + '", "CODE" : "' + code + '"}'
       main = main.replace($MODULE_CONFIG, config )
       //println(main)

       // Return the page
       return main
   }











    /**
     * @param module    FAOSTAT module: browse, download, search, compare, analysis, mes, home
     * @param group     FAOSTAT DB group
     * @param domain    FAOSTAT DB group
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    /**@GET
    @Produces(MediaType.TEXT_HTML)
    @Path("/{module}/{group}/{domain}/{lang}")
    String loadModule(@PathParam("module") String module, @PathParam("group") String group, @PathParam("domain") String domain, @PathParam("lang") String lang) {
        println('HERE')
        HashMap<String, String> configMap = readConfigFile();
        String main = replaceHtml(configMap, 'faostat-'+ module +'-js', module, lang);
        main = main.replace('$_GROUP_CODE', (group == "*" ? "null" : group));
        main = main.replace('$_DOMAIN_CODE', (domain == "*" ? "null" : domain));
        def faostatLang = getFAOSTATLang(lang)
        main = main.replace('$_LANG', faostatLang)
        main = main.replace('$_ISO2_LANG', lang)
        // Return the page
        return main
    }  **/


    /**
     * @param module   FAOSTAT module: browse, download, search, compare, analysis, mes
     * @param word      The word to search ( i.e. 'rice')
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("search/{word}/{lang}")
    String loadModuleSearch(@PathParam("word") String word, @PathParam("lang") String lang) {
        HashMap<String, String> configMap = readConfigFile();
        String main = replaceHtml(configMap, 'faostat-search-js', 'search', lang);
        main = main.replace($_WORD, (word == "*" ? "" : word));
        // Return the page
        return main
    }

    HashMap<String, String> readConfigFile() {
        def config = ConfigServlet.PATH + CONFIG_FILE;
        def configContent = new File(config).text;
        Gson g = new Gson();
        return g.fromJson(configContent, HashMap.class);
    }

    String getFAOSTATLang(String iso2) {
        if      ( iso2.toUpperCase() == "EN") return "E";
        else if ( iso2.toUpperCase() == "FR") return "F";
        else if ( iso2.toUpperCase() == "ES") return "S";
        return "E";
    }


    String getLangISo2(String lang) {
        if      ( lang.toUpperCase() == "E") return "EN";
        else if ( lang.toUpperCase() == "F") return "FR";
        else if ( lang.toUpperCase() == "S") return "ES";
        return "en";
    }

    String replaceHtml(configMap, modulepath, modulecode, lang) {

        // set lang always as toUpperCase
        lang = lang.toUpperCase();

        // HTLM CONTENT
        def main = new URL('http://' + configMap.get($_GATEWAY_REPO_BASE_URL) + "/faostat/base_index.html").getText()

        main = main.replace($_MODULE_CODE, modulecode)
        main = main.replace($_GATEWAY_REPO_BASE_URL, configMap.get($_GATEWAY_REPO_BASE_URL))
        main = main.replace($_MODULES_BASE_URL, configMap.get($_MODULES_BASE_URL))

        def faostatLang = getFAOSTATLang(lang)
        main = main.replace($_FAOSTAT_LANG, faostatLang)
        main = main.replace($_ISO2_LANG, lang)

        // TODO: make it nicer
        main = main.replace($_DISPLAY_SEARCH, 'true')

        // Set page's title
        // main = main.replace('$_SECTION_NAME', "home")

        // Load the module
        def moduleContent = new URL('http://' + configMap.get($_GATEWAY_REPO_BASE_URL) + "/faostat/" + modulepath +"/index_gateway.html").getText();

        // Replace wildcards with parameters from the REST
        moduleContent = moduleContent.replace($_ISO2_LANG, faostatLang)
        moduleContent = moduleContent.replace($_GATEWAY_REPO_BASE_URL, configMap.get($_GATEWAY_REPO_BASE_URL))


        // Inject the module into the main HTML
        main = main.replace($_CONTENT, moduleContent);
        return main;
    }

}