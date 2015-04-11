var fs = require('fs');
var _ = require('lodash');

module.exports = function() {
    var allPhrase, pHeads = {},
        wHeads = {},
        wTails = {},
        pTails = {},
        bigSpace = '　';

    function init() {
        console.log('phrase loading...');
        allPhrase = JSON.parse(fs.readFileSync('all.dat', 'UTF-8'));
        console.log('phrase loaded');
    }

    function reorg() {
        console.log('reorg processing...');
        _.forEach(allPhrase, function(value, key) {
            var wordPronounces = value.split(bigSpace);
            pushTo(wHeads, key.charAt(0), key);
            pushTo(pHeads, wordPronounces[0], key);
            //pushTo(pTails, wordPronounces[wordPronounces.length - 1], key);
            //fs.writeFileSync('wHeads.txt', JSON.stringify(wHeads, null, 2));
        });

        //fs.writeFile('pHeads.txt', JSON.stringify(pHeads, null, 2));
        //fs.writeFile('pTails.txt', JSON.stringify(pTails, null, 2));
        console.log('reorg processed');
    }

    function pushTo(list, key, value) {
        if (list[key]) {
            list[key].push(value);
            return;
        }

        list[key] = [value];
    }

    function query(str, strict) {
        if (!allPhrase[str]) {
            return ['我不認得這句成語啊'];
        }

        if (strict === 'true') {
            return wHeads[str.charAt(str.length - 1)] || [];
        } else {
            var wordPronounces = allPhrase[str].split(bigSpace),
                tail = wordPronounces[wordPronounces.length - 1];
            return pHeads[tail] || [];
        }


    }

    init();
    reorg();
    return {
        query: query
    };
}();