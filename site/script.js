function jsonp(url, data, callback) {
  const src = url + (url.indexOf("?") > -1 ? "&" : "?");
  const head = document.querySelector("head");
  const script = document.createElement("script");
  script.type = "text/javascript";

  window.jsonpCallback = (data) => {
    head.removeChild(script);
    callback(data);
  };

  data.c = "jsonpCallback";

  const params = [];

  Object.keys(data).forEach((param) => {
    params.push(param + "=" + encodeURIComponent(data[param]));
  });

  script.src = src + params.join("&");

  head.appendChild(script);
}

function getFormData(form) {
  const data = {};

  Array.prototype.forEach.call(form.elements, (el) => {
    if (el.type === "checkbox" && el.checked === true) {
      data[el.name] = el.value;
    } else if (el.name.length > 0 && el.value.length > 0) {
      data[el.name] = el.value;
    }
  });

  return data;
}

function installMailchimp() {
  const form = document.querySelector("#mailchimp-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = getFormData(form);
      const url = form.action.replace("/post?", "/post-json?");

      jsonp(url, data, (data) => {
        const response = document.querySelector("#mailchimp-response");

        response.classList.remove("hidden", "success", "error");

        if (data && data.result === "success") {
          response.classList.add("success");
          response.innerHTML = data.msg;
        } else if (data && data.result === "error") {
          response.classList.add("error");
          response.innerHTML = data.msg;
        } else {
          response.classList.add("error");
          response.innerHTML =
            "There was an unexpected error when submitting, please try again later";
        }
      });
    });
  }
}

function installPrizeDraw() {
  const form = document.querySelector("#prize-draw-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = getFormData(form);
      const url = form.action;

      jsonp(url, data, (data) => {
        const response = document.querySelector("#prize-draw-response");

        response.classList.remove("hidden", "success", "error");

        if (data && data.message) {
          response.classList.add("success");
          response.innerHTML = data.message;
        } else {
          response.classList.add("error");
          response.innerHTML =
            "There was an unexpected error when submitting, please try again later";
        }
      });
    });
  }
}

function initGoToTopBtn() {
  const goTopBtn = document.querySelector(".back-to-top");

  function trackScroll() {
    const scrolled = window.pageYOffset;
    const threshold = 400;

    if (scrolled > threshold) {
      goTopBtn.classList.remove("hidden");
    }
    if (scrolled < threshold) {
      goTopBtn.classList.add("hidden");
    }
  }

  function scrollToTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      scrollToTop();
    }
  }

  window.addEventListener("scroll", trackScroll, { passive: true });
  goTopBtn.addEventListener("click", backToTop);
}

installMailchimp();
installPrizeDraw();
initGoToTopBtn();
