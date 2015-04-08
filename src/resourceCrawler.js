var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');

var qList = [],
    qll = 0,
    all = {},
    doneCount = 0;

for(var c = 97; c < 123; c++) {
    qList.push(String.fromCharCode(c));
}

qll = qList.length;

ccdPromiseMaker = function(item) {
    var d = Q.defer();
    request({
        url: 'http://dict.idioms.moe.edu.tw/cgi-bin/cydic/gsweb.cgi?o=dcydic&schfmt=pic',
        method: 'GET'
    }, function(error, reponse, body) {
        /*var s = body.indexOf("ccd="),
         e = body.indexOf('&', s),
         ccd = body.substring(s + 4, e);*/
        var ccd = body.match(/(ccd=)(\S{6})\&/)[2];

        if (ccd) {
            d.resolve({
                item: item,
                ccd: ccd
            });
        } else {
            d.reject();
        }
    });

    return d.promise;
};

queryByItem = function(info) {
    var item = info.item,
        ccd = info.ccd,
        totalPagesZW;

    console.log('queryByItem: ', item, ccd);

    //first time, get the pages
    var p = queryPromiseMaker(item, ccd, 1, 'zw');
    p.then(function(info) {
        totalPagesZW = info.pages;
        console.log('after the first call, totalPagesZW is ' + totalPagesZW);
        /*for (var i = 1 + 1; i <= pages; i++) {
            console.log('add', ccd, i);
            p.then(queryPromiseMaker(item, ccd, i));
        }*/
        var others = [];
        for (var i = 1 + 1; i <= totalPagesZW; i++) {
            console.log('add', ccd, i);
            others.push(queryPromiseMaker(item, ccd, i, 'zw'));
        }
        Q.all(others).then(writeFile);
    });

    //附錄...列表沒有讀音
    //first time, get the pages
    /*var p2 = queryPromiseMaker(item, ccd, 1, 'fl');
    p2.then(function(info) {
        totalPagesFL = info.pages;
        console.log('after the first call, totalPagesFL is ' + totalPagesFL);
        for (var i = 1 + 1; i <= pages; i++) {
            console.log('add', ccd, i);
            p.then(queryPromiseMaker(item, ccd, i));
        }
        var others = [];
        for (var i = 1 + 1; i <= totalPagesFL; i++) {
            console.log('add', ccd, i);
            others.push(queryPromiseMaker(item, ccd, i, 'fl'));
        }
        Q.all(others).then(writeFile);
    });*/
};
writeFile = function(info) {
    console.log('writing all to file: all.dat', JSON.stringify(info));
    //console.log(JSON.stringify(all, null, 2));
    doneCount++;
    if (doneCount !== qll) {
        console.log('but still waiting other item');
        return;
    }
    fs.writeFile('all.dat', JSON.stringify(all, null, 2));
};
queryPromiseMaker = function(item, ccd, page, type) {
    console.log('queryPromiseMaker', item, ccd, page);
    var d = Q.defer();
    request({
        url: 'http://dict.idioms.moe.edu.tw/cgi-bin/cydic/gsweb.cgi',
        formData: {
            ccd: ccd,
            input: '檢索',
            sec: 'sec1',
            basicoptsch: 1,
            o: 'e0',
            qs0: item,
            jmpage: page,
            resultype: type
        }
    }, function(error, response, body) {
        var pages = null,
            lastPageHref = null;
        if (error) {
            log.error(error);
            d.reject(error);
        }
        //console.log(body);
        $ = cheerio.load(body);

        $('.fmt1table tr').each(function(index, element) {
            var _this = $(element),
                key, pronounce;
            if (_this.find('td.mainth').length > 0) {
                return;
            }
            key = _this.find('.fmt1title').text();
            if (all[key]) {
                //exist;
                return;
            }
            pronounce = _this.find('.fmt1zy_div').text();
            //console.log(_this.find('.fmt1title').text() + ': ' + _this.find('.fmt1zy_div').text());
            all[key] = pronounce;

        });
        lastPageHref = $('.preview a:last-child').attr('href') || '';
        if (lastPageHref) {
            var matchs = lastPageHref.match(/(jmpage=)(\S+)(\#jpgopt)/);
            if (matchs && matchs.length > 3)
                pages = parseInt(matchs[2], 10);
        }

        d.resolve({
            pages: pages,
            item: item
        });
    });

    return d.promise;
};

for (var i = qll - 1; i > -1; i--) {
    var ccdPromise = ccdPromiseMaker(qList[i]);

    ccdPromise.then(queryByItem);
}