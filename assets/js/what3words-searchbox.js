
if (typeof What3wordsSearchbox != "undefined") {
    var country = What3wordsSearchbox.country_filter_selector !== '' ? What3wordsSearchbox.country_filter_selector : What3wordsSearchbox.country_code;
    // $(What3wordsSearchbox.input_selectors).w3wAddress({
    //     debug: true,
    //     key: What3wordsSearchbox.api_key,
    //     items_to_show: What3wordsSearchbox.suggestions,
    //     multilingual: What3wordsSearchbox.multilingual,
    //     lang: What3wordsSearchbox.lang,
    //     results: What3wordsSearchbox.suggestions,
    //     country_filter: country,
    //     direction: What3wordsSearchbox.text_direction,
    //     placeholder: What3wordsSearchbox.input_placeholder,
    //     validation: true
    // });

    console.log(What3wordsSearchbox);


    const w3wComponent = document.createElement('what3words-autosuggest', { is: 'what3words-autosuggest' })
    const input_selectors = document.querySelectorAll(`${What3wordsSearchbox.input_selectors}`)

    input_selectors.forEach((target_input) => {
      target_input.parentNode.replaceChild(w3wComponent, target_input);
    })

}


/*
specimen:

<what3words-autosuggest
autosuggest-focus="51.4911,-0.2120"
clip-to-bounding-box="51.4912,-0.2121,51.4911,-0.2120"
clip-to-circle="51.4911,-0.2120,6"
clip-to-country="AG"
clip-to-polygon
error-message="whoops!"
language="pt"
n-focus-results="3"
n-results="5"
placeholder="your.three.words"

/>



*/