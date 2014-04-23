if (!window.UIUtils) {

    window.UIUtils = {

        noValuesFoundPanel : function(id) {
            $("#" + id).empty();
            $("#" + id).addClass('no-values-panel');
            $("#" + id).append('No data to display - Please make another selection')
        },

        initializeDDMenu: function(menuID, dropdownID, dropdownToNotShowID) {
            $('#' + menuID).on('click touchstart', function () {
                $('#' + dropdownID).slideToggle();

                if ( $("#"+ dropdownToNotShowID +":visible") ) {
                    $('#' + dropdownToNotShowID).slideUp();
                }

            });
        }
    };

}
