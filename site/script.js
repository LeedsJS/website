function jsonp(url, data, callback) {
    const src = url + (url.indexOf('?') > -1 ? '&' : '?');
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.type = 'text/javascript';

    window.mailchimpCallback = (data) => {
        head.removeChild(script);
        callback(data);
    };

    data.c = 'mailchimpCallback';

    const params = [];

    Object.keys(data).forEach((param) => {
        params.push(param + '=' + encodeURIComponent(data[param]))
    });

    script.src = src + params.join('&');

    head.appendChild(script);
}

function getFormData(form) {
    const data = {};

    Array.prototype.forEach.call(form.elements, (el) => {
        if (el.name.length > 0 && el.value.length > 0) {
            data[el.name] = el.value;
        }
    });

    return data;
}

function installMailchimp() {
    const form = document.querySelector('#mailchimp-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = getFormData(form);
        const url = form.action.replace('/post?', '/post-json?');

        jsonp(url, data, (data) => {
            const response = document.querySelector('#mailchimp-response');

            response.classList.remove('hidden');

            if (data && data.result === 'success') {
                response.innerHTML = data.msg;
            } else if (data && data.result === 'error') {
                response.innerHTML = data.msg;
            } else {
                response.innerHTML = "There was an unexpected error when submitting, please try again later";
            }
        });
    });
}

function lazyLoad() {
    Array.prototype.forEach.call(document.querySelectorAll('div[data-type="lazy"]'), (el) => {
        if ((el.getBoundingClientRect().top - window.innerHeight) <= 0) {
            const newEl = document.createElement(el.dataset.tag);
            Array.prototype.forEach.call(el.attributes, (attr) => {
                newEl.setAttribute(attr.name, attr.value);
            })
            el.parentNode.replaceChild(newEl, el);
        }
    });
}

function initGoToTopBtn() {
    const goTopBtn = document.querySelector('.back-to-top');

    function trackScroll() {
        const scrolled = window.pageYOffset;
        const threshold = 400;

        if (scrolled > threshold) {
            goTopBtn.classList.remove('hidden');
        }
        if (scrolled < threshold) {
            goTopBtn.classList.add('hidden');
        }
    }

    function scrollToTop() {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, c - c / 8);
        }
    };

    function backToTop() {
        if (window.pageYOffset > 0) {
            scrollToTop();
        }
    }

    window.addEventListener('scroll', trackScroll);
    goTopBtn.addEventListener('click', backToTop);
};

lazyLoad();
installMailchimp();
initGoToTopBtn();
window.addEventListener('scroll', lazyLoad, { passive: true })
