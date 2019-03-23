/**
 * fastLangID.js
 * Stand-alone Language Identification for Node.js JavaScript based on FastText
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2019 Loreto Parisi
*/
(function () {

    var FastLangID = require('../lib/index');

    var document = "I caught a glimpse of him from the bus.\n\
    Ich habe gewusst, dass ihr Tom nicht vergessen würdet.\n\
    Voi avete una famiglia numerosa?,\n\n\
    J'isolais les bêtes malades."

    // predict 2 most likely labels
    var langId = new FastLangID({ mostlikely:2 });
    // load language detector model and api
    langId.load()
        .then(done => {
            return langId.detectSentences(document)
        })
        .then(results => {
            console.log(JSON.stringify(results,null,2));
            // unload language detector from memory
            return langId.unload();
        })
        .catch(error => {
            console.error("error:%s\n%@", error, error.stack);
        });

}).call(this);