var document_ = document;

function Locale_() {
}

Locale_.AJAX_ = function (method, URL, data, success, fail) {
    var temp_ = [];

    for (var i_ in data) {
        if (data.hasOwnProperty(i_)) {
            temp_.push(i_ + '=' + data[i_]);
        }
    }

    data = temp_.join('&');

    if (method.toLowerCase() === 'get') {
        URL += '?' + data;
        data = null;
    }

    var x_ = new XMLHttpRequest();
    x_.open(method, URL, true);

    if (method.toLowerCase() === 'post') {
        x_.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    x_.send(data);

    x_.onreadystatechange = function () {
        if (x_.readyState === 4) {
            if (x_.status === 200) {
                if (success) {
                    success(JSON.parse(x_.response));
                }
            } else {
                if (fail) {
                    fail(x_);
                }
            }
        }
    }
}

Locale_.setLocaleEvent_ = function () {
    var locales_ = document_.querySelectorAll('[data-locale]'),
        length_ = locales_.length;

    if (locales_ && length_) {
        for (var i_ = 0; i_ < length_; i_++) {
            locales_[i_].addEventListener('click', function (event) {
                var target_ = event.target,
                    locale_ = target_.dataset.locale;

                if (!locale_) {
                    return false;
                }

                event.preventDefault();

                function setLocale_() {
                    Locale_.setLocale_(locale_);
                }

                if (!Locale_.locales_[locale_]) {
                    Locale_.AJAX_('get', locale_ + '.json', null, function (response_) {
                        Locale_.locales_[locale_] = response_;

                        setLocale_(locale_);
                    });
                } else {
                    setLocale_(locale_);
                }
            });
        }
    }
}

Locale_.setLocale_ = function (locale_) {
    var elements_ = document_.querySelectorAll('[lang]'),
        length_ = elements_.length;

    if (elements_ && length_) {
        for (var i_ = 0; i_ < length_; i_++) {
            var element_ = elements_[i_],
                lang_ = element_.getAttribute('lang');

            if (element_.tagName !== 'HTML') {
                if (!Locale_.locales_[Locale_.currentLocale_]) {
                    Locale_.locales_[Locale_.currentLocale_] = {};
                }

                if (!Locale.locales_[Locale.currentLocale_][lang_]) {
                    if (element_.tagName === 'INPUT') {
                        if (element_.placeholder && element_.placeholder.length) {
                            Locale.locales_[Locale.currentLocale_][lang_] = element_.placeholder.trim();
                        } else {
                            Locale.locales_[Locale.currentLocale_][lang_] = element_.value;
                        }
                    } else {
                        Locale.locales_[Locale.currentLocale_][lang_] = element_.innerText;
                    }
                }

                if (element_.tagName === 'INPUT') {
                    if (element_.placeholder) {
                        element_.placeholder = Locale.locales_[locale_][lang_];
                    } else {
                        element_.value = Locale.locales_[locale_][lang_];
                    }
                } else {
                    element_.innerHTML = Locale.locales_[locale_][lang_];
                }
            }
        }
    }

    Locale_.currentLocale_ = locale_;
}

Locale_.currentLocale_ = 'ru';
Locale_.locales_ = {};
