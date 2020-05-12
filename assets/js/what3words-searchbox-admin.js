(function($) {
    $(document).ready(function() {
        $('input[type="checkbox"][name="what3words-searchbox-country-filter"]').on('change', function() {
            $('#what3words-searchbox-country-wrap').toggle('slow');
        });
        $('input[type="text"]#what3words-searchbox-country-filter-selector').on('keyup', function(){
            if($(this).val() !== '') {
                $('#what3words-searchbox-country').prop('disabled', true);
            } else {
                $('#what3words-searchbox-country').prop('disabled', false);
            }
        });
        $('input[type="checkbox"]#what3words-disable-field-boolean').on('change', function(e){
            // if(this.checked) {
                $('#what3words-disable-field').toggle('slow');
            // }
        });
    });
})(jQuery);
