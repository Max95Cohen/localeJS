var d = document;

function Locale() {
}

Locale.AJAX_ = function (method_, URL_, data_, success_, fail_) {
    var temp = [];

    for (var i in data_) {
        if (data_.hasOwnProperty(i)) {
            temp.push(i + '=' + data_[i]);
        }
    }

    data_ = temp.join('&');

    if (method_.toLowerCase() === 'get') {
        URL_ += '?' + data_;
        data_ = null;
    }

    var x = new XMLHttpRequest();
    x.open(method_, URL_, true);

    if (method_.toLowerCase() === 'post') {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    x.send(data_);

    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            if (x.status === 200) {
                if (success_) {
                    success_(JSON.parse(x.response));
                }
            } else {
                if (fail_) {
                    fail_(x);
                }
            }
        }
    }
}

Locale.setLocaleEvent_ = function () {
    var locales_ = d.querySelectorAll('[data-locale]'),
        length_ = locales_.length;

    if (locales_ && length_) {
        for (var i = 0; i < length_; i++) {
            locales_[i].addEventListener('click', function (event_) {
                var target_ = event_.target,
                    locale_ = target_.dataset.locale;

                if (!locale_) {
                    return false;
                }

                event_.preventDefault();

                function setLocale_() {
                    Locale.setLocale_(locale_);
                }

                if (!Locale.locales_[locale_]) {
                    Locale.AJAX_('get', locale_ + '.json', null, function (response_) {
                        Locale.locales_[locale_] = response_;

                        setLocale_(locale_);
                    });
                } else {
                    setLocale_(locale_);
                }
            });
        }
    }
}

Locale.setLocale_ = function (locale_) {
    var elements_ = d.querySelectorAll('[lang]'),
        length_ = elements_.length;

    if (elements_ && length_) {
        for (var i = 0; i < length_; i++) {
            var element_ = elements_[i],
                lang_ = element_.getAttribute('lang');

            if (element_.tagName !== 'HTML') {
                if (!Locale.locales_[Locale.currentLocale_]) {
                    Locale.locales_[Locale.currentLocale_] = {};
                }

                if (!Locale.locales_[Locale.currentLocale_][lang_]) {
                    Locale.locales_[Locale.currentLocale_][lang_] = element_.innerText;
                }

                element_.innerHTML = Locale.locales_[locale_][lang_];
            }
        }
    }

    Locale.currentLocale_ = locale_;
}

Locale.currentLocale_ = 'ru';
Locale.locales_ = {};
