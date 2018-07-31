var prideSocket = new WebSocket('ws://' + window.location.host + '/ws/humans/');
var searchQueries = [];
prideSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var queries = data['message'];
    if (searchQueries.length < 200) {
        searchQueries.push.apply(searchQueries, queries);
    }
};
prideSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function checkForEntry() {
    var isCacheEmpty = searchQueries.length === 0;
    if (isCacheEmpty) {
        delay(function () {
            checkForEntry()
        }, 500)
    } else {
        var home_quote = document.getElementById('home_quote');
        home_quote.classList.remove('fadeInDown');
        ['fadeInDown', 'slow'].map(item => home_quote.classList.remove(item)
    )
        ;
        home_quote.classList.add('fadeOutDown');
        document.getElementById('header_div').classList.remove('hidden');
        document.getElementById('head_1').classList.add('rotateInDownLeft');
        document.getElementById('head_2').classList.add('rotateInDownRight');
        fromCacheToHtml();
        showElements();
    }
}

ready(function () {
    anime({
        targets: '#ev_s',
        color: [
            {value: '#2196f3'},
            {value: '#FFF'}
        ],
        loop: true,
        easing: 'linear',
        direction: 'alternate',
        duration: 5000,
    });
    delay(function () {
        checkForEntry()
    }, 4000);
});

function fromCacheToHtml() {
    var elementsToShow = searchQueries.splice(0, 10);
    var insert = '';
    for (var i = 0; i < elementsToShow.length; i++) {
        var item = elementsToShow[i];
        insert += '<div class="wrapper"><div class="item">' +
            '<a class="link" target="_blank" href="https://www.yandex.ru/search/?text=' + item + '">' +
            elementsToShow[i] +
            '</div></div>';
    }
    document.getElementById('search-items').innerHTML = insert;
}

function showElements() {
    var els = document.querySelectorAll('.item');
    var callback = anime({
        targets: els,
        translateX: [-200, "0%"],
        easing: 'easeInOutBack',
        elasticity: 100,
        duration: function (el, i, l) {
            return 200 + (i * 200);
        },
        delay: function (el, i, l) {
            return i * 30;
        },
    });

    callback.complete = function () {
        delay(function () {
            moveRight(els);
        }, 4000);
    };
}

function moveRight(els) {
    var callback = anime({
        targets: els,
        translateX: ["0%", "100vw"],
        easing: 'easeInOutBack',
        duration: function (el, i, l) {
            return 150 + (i * 150);
        },
        delay: function (el, i, l) {
            return i * 10;
        },
    });
    callback.complete = function () {
        // start new loop
        fromCacheToHtml();
        showElements();
    }
}