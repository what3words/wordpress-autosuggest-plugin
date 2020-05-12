jQuery(document).ready(function($) {
    if (typeof What3wordsSearchbox != "undefined") {
        var country = What3wordsSearchbox.country_filter_selector !== '' ? What3wordsSearchbox.country_filter_selector : What3wordsSearchbox.country_code;
        $(What3wordsSearchbox.input_selectors).w3wAddress({
            debug: true,
            key: What3wordsSearchbox.api_key,
            items_to_show: What3wordsSearchbox.suggestions,
            multilingual: What3wordsSearchbox.multilingual,
            lang: What3wordsSearchbox.lang,
            results: What3wordsSearchbox.suggestions,
            country_filter: country,
            direction: What3wordsSearchbox.text_direction,
            placeholder: What3wordsSearchbox.input_placeholder,
            validation: true
        });

        if (What3wordsSearchbox.disabled_selector_bool !== '') {
            // console.log(What3wordsSearchbox.disabled_selector);
            $(What3wordsSearchbox.disabled_selector).attr('disabled', 'disabled');
            $(What3wordsSearchbox.input_selectors).on('keyup searched selection', function(){
                setTimeout(() => {
                    if ($(this).hasClass('valid')) {
                        $(What3wordsSearchbox.disabled_selector).removeAttr('disabled');
                    } else {
                        $(What3wordsSearchbox.disabled_selector).attr('disabled', 'disabled');
                    }
                }, 500);
            });
            $(What3wordsSearchbox.input_selectors).on('cancel', function () {
                $(What3wordsSearchbox.disabled_selector).removeAttr('disabled');
            });
        }
    }
});
