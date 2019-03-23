/**
 * fastLangID.js
 * Stand-alone Language Identification for Node.js JavaScript based on FastText
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2019 Loreto Parisi
*/
(function () {

    var FastLangID = require('../lib/index');

    var documents = [
        "I caught a glimpse of him from the bus.",
        "Ich habe gewusst, dass ihr Tom nicht vergessen würdet.",
        "Voi avete una famiglia numerosa?",
        "J'isolais les bêtes malades."
    ];

    // predict 2 most likely labels
    var langId = new FastLangID({ mostlikely:2 });
    // load language detector model and api
    langId.load()
        .then(done => {
            var promises = documents.map(document => langId.detectDocument(document));
            return Promise.all(promises);
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