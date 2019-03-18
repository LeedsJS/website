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
