# fastLangID
Stand-alone Language Identification for Node.js JavaScript based on [FastText.js](https://github.com/loretoparisi/fasttext.js/)

# Table of Contents
- [fastLangID APIs](https://github.com/loretoparisi/fastLangID#fastlangid-apis)
- [How to Install](https://github.com/loretoparisi/fastLangID#how-to-install)
	* [Install via NPM](https://github.com/loretoparisi/fastLangID#install-via-npm)
- [How to Use](https://github.com/loretoparisi/fastLangID#how-to-use)
    * [Detect Document](https://github.com/loretoparisi/fastLangID#detect-document)
    * [Detect Sentences](https://github.com/loretoparisi/fastLangID#detect-sentences)

## fastLangID APIs
This version of `fastLangID` comes with the following `JavaScript` APIs

```javascript
fastLangID.new({})
fastLangID.load()
fastLangID.unload()
fastLangID.detectDocument(String)
fastLangID.detectSentences(String)
```

## How to Install
```bash
git clone https://github.com/loretoparisi/fastLangID.git
cd fastLangID
npm install
```

### Install via NPM
`fastLangID` is available as a npm module [here](https://www.npmjs.com/package/fastLangID). To add the package to your project

```bash
npm install --save fastLangID
```

## How to Use
To load `fastLangID` language detector call the `load` api

```javascript
var langId = new FastLangID({});
langId.load()
.then(done => {
})
.catch(error => {

});
```

### Detect Document
To detect the languages in a document call the `detectDocument` api after the `fastLangID` has been loaded

```javascript
var document="I caught a glimpse of him from the bus.";
var langId = new FastLangID({});
langId.load()
.then(done => {
    return langId.detectDocument(document);
})
.then(detection => {
})
.catch(error => {

});
```

This will return a `json` object with labels predictions, where `label` is the most likely predicted language, while `scores` containes the probabilities for each language code. Language codes are `ISO-639-2` formatted (two characters code, like `IT`).


```json
{
    "label": "EN",
    "scores": {
      "EN": 0.989217,
      "ES": 0.00151357
    }
  }
```

### Detect Sentences
To detect the languages of sentences in a document call the `detectSentences` api after the `fastLangID` has been loaded. The input `text` must have newlines terminators (`\n`, `\r\n`). It supports multiple line terminators like `\n\n`.

```javascript
var document = "I caught a glimpse of him from the bus.\n\Ich habe gewusst, dass ihr Tom nicht vergessen würdet.\nVoi avete una famiglia numerosa?";
var langId = new FastLangID({});
langId.load()
.then(done => {
    return langId.detectSentences(document);
})
.then(detections => {
})
.catch(error => {

});
```

This will return a `json` array of object with labels predictions for each predicted sentence. The `line` contains the input sentence, while `detection` contains the labels as seen before.


```json
[
  {
    "line": "I caught a glimpse of him from the bus.",
    "detection": {
      "label": "EN",
      "scores": {
        "EN": 0.989217,
        "ES": 0.00151357
      }
    }
  },
  {
    "line": "Ich habe gewusst, dass ihr Tom nicht vergessen würdet.",
    "detection": {
      "label": "DE",
      "scores": {
        "DE": 0.999884,
        "FR": 0.0000696995
      }
    }
  },
  {
    "line": "Voi avete una famiglia numerosa?,",
    "detection": {
      "label": "IT",
      "scores": {
        "IT": 0.995784,
        "ES": 0.0011519
      }
    }
  }
]
```