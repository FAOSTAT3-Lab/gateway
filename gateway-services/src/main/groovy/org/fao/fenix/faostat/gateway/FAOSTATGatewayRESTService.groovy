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



    def CONFIG_FILE = 'static/faostat/config/config.json'

    /**
     * @param section   FAOSTAT section: browse, download, search, compare, analysis, mes, home
     * @param group     FAOSTAT DB group
     * @param domain    FAOSTAT DB group
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("/{section}/{group}/{domain}/{lang}")
    String loadModule(@PathParam("section") String section, @PathParam("group") String group, @PathParam("domain") String domain, @PathParam("lang") String lang) {

        HashMap<String, String> configMap = readConfigFile();
        String main = replaceHtml(configMap, 'faostat-'+ section +'-js', lang);

        main = main.replace('$_GROUP_CODE', (group == "*" ? "null" : group));
        main = main.replace('$_DOMAIN_CODE', (domain == "*" ? "null" : domain));
        main = main.replace('$_LANG', lang);

        // Return the page
        return main
    }


    /**
     * @param section   FAOSTAT section: browse, download, search, compare, analysis, mes
     * @param word      The word to search ( i.e. 'rice')
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("search/{word}/{lang}")
    String loadModuleSearch(@PathParam("word") String word, @PathParam("lang") String lang) {

        HashMap<String, String> configMap = readConfigFile();
        String main = replaceHtml(configMap, 'faostat-search-js', lang);

        main = main.replace('$_WORD', (word == "*" ? "" : word));

        // Return the page
        return main
    }


    /**
     * @param section   FAOSTAT section: home
     * @param lang      E, F or S
     * @return          HTML code to be rendered by the browser
     */
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("home/{lang}")
    String loadModuleHome(@PathParam("lang") String lang) {
        // Fetch the base HTML
        HashMap<String, String> configMap = readConfigFile();
        String main = replaceHtml(configMap, 'faostat-home-js', lang);

        main = main.replace('$_BASE_URL', configMap.get("base_url"))

        // Return the page
        return main
    }

    String replaceHtml(configMap, section, lang) {
        def base_index_url = ConfigServlet.PATH + "static/faostat/base_index.html"
        // Load main HTML content
        def content = null;
        def main =  new File(base_index_url).text;
        main = main.replace('$_BASE_URL', configMap.get("base_url"))

        main = main.replace('$_LANG', lang)
        main = main.replace('$_ISO2_LANG', getLangISo2(lang))

        // TODO: make it nicer
        main = main.replace('$_DISPLAY_SEARCH', 'true')

        // Set page's title
        main = main.replace('$_SECTION_NAME', "home")

        // Load the module
        def sectionURL = ConfigServlet.PATH + "static/faostat/"+ section +"/index_gateway.html"

        // Fetch its content
        content = new File(sectionURL).text;

        // Replace wildcards with parameters from the REST
        content = content.replace('$_LANG', lang)
        content = content.replace('$_BASE_URL', configMap.get("base_url"))

        // Inject the module into the main HTML
        main = main.replace('$_CONTENT', content);
        return main;
    }

    HashMap<String, String> readConfigFile() {
        def config = ConfigServlet.PATH + CONFIG_FILE;
        println(ConfigServlet.PATH);
        println(config);
        def configContent = new File(config).text;
        Gson g = new Gson();
        return g.fromJson(configContent, HashMap.class);
    }


    String getLangISo2(String lang) {
        if ( lang.toUpperCase() == "E")
            return "en";
        else if   ( lang.toUpperCase() == "F")
            return "fr";
        else if   ( lang.toUpperCase() == "S")
            return "es";
        return "en";
    }

}