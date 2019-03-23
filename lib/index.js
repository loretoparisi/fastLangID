/**
 * fastLangID.js
 * Stand-alone Language Identification for Node.js JavaScript based on FastText
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2019 Loreto Parisi
*/
(function () {

  var FastText = require('fasttext.js');
  var path = require('path');

  function GetFolderPath(folder, filename) {
    var cdir = process.cwd();
    var pathComponents = __dirname.split('/');
    var root = pathComponents.slice(0, pathComponents.length).join('/');
    process.chdir(root);
    var binpath = path.resolve('.' + path.sep + folder + path.sep + filename);
    process.chdir(cdir);
    return binpath;
  }
  function mergeRecursive(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);

        } else {
          obj1[p] = obj2[p];

        }

      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];

      }
    }
    return obj1;
  }

  var FastLangID;
  FastLangID = (function () {

    /**
     * Musixmatch Language Detection
     * @see FastText
     */
    function FastLangID(options) {
      var self = this;

      // default options
      this.options = {
        // debugging
        debug: false,
        mostlikely: 3,
        fasttext: {
          loadModel: '',
          debug: false,
          predict: {
            mostlikely: 3 // most likely labels
          },
        }
      };
      mergeRecursive(this.options, options);

      // fasttext backend options
      this.options.fasttext.loadModel = GetFolderPath('bin', 'lid.176.ftz');
      this.options.fasttext.predict.mostlikely = this.options.mostlikely;
      this.options.fasttext.debug = this.options.debug;

    }//FastLangID

    /**
     * Load module
     * @return {Promise}
     */
    FastLangID.prototype.load = function () {
      var self = this;
      return new Promise(function (resolve, reject) {
        // autoload model for inference
        self.fastText = new FastText(self.options.fasttext);
        // load model
        self.fastText.load()
          .then(_ => {
            return resolve(true);
          })
          .catch(error => {
            if (self.options.debug) console.error(error);
            return reject(error);
          });

      });
    }//load

    /**
     * Unload module
     * @return {Promise}
     */
    FastLangID.prototype.unload = function () {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.fastText.unload()
          .then(_ => {
            return resolve(true);
          })
          .catch(error => {
            if (self.options.debug) console.error(error);
            return reject(error);
          });
      });
    }//unload

    /**
     * Detect language in a text document
     * @param {String} text
     * @return {Promise}
     */
    FastLangID.prototype.detectDocument = function (text) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.fastText.predict(text)
          .then(result => {
            var response = {};
            // order by best score (desc)
            result.sort(function (a, b) { return b.score - a.score; });
            response.label = result[0].label; // higher score
            response.scores = {};
            result.forEach(item => {
              response.scores[item.label] = parseFloat(item.score);
            });
            return resolve(response);
          })
          .catch(error => {
            return reject(error);
          });
      });
    }//detectDocument

    /**
     * Detect language line by line
     * @param {String} text Text document with newline `\n` separator
     * @return {Promise}
     */
    FastLangID.prototype.detectSentences = function (text) {
      var self = this;
      var sentences = text.split(/[[\n|\r|\r\n]/g);
      var promises = sentences.map(line => new Promise((resolve, reject) => {
        self.detectDocument(line)
          .then(result => {
            return resolve({
              line: line,
              detection: result
            });
          })
          .catch(_ => { // ignore to not break Promise
            return resolve({
              line: line
            });
          });
      }));
      return Promise.all(promises);
    }//detectSentences

    return FastLangID;

  })();

  module.exports = FastLangID;

}).call(this);
