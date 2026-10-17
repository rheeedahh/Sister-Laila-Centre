

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initForms();
});

/* --------------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------------- */
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu after tapping a nav link (mobile)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close the menu if someone taps outside it
  document.addEventListener('click', function (event) {
    var clickedInsideNav = nav.contains(event.target);
    var clickedToggle = toggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}


function initForms() {
  var forms = document.querySelectorAll('form[action*="formspree.io"]');

  forms.forEach(function (form) {
    var statusEl = form.querySelector('.form-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (statusEl) {
        statusEl.textContent = 'Sending…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            if (statusEl) {
              statusEl.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
            }
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error(
                data && data.errors
                  ? data.errors.map(function (e) { return e.message; }).join(', ')
                  : 'Something went wrong.'
              );
            });
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = 'Sorry, something went wrong. Please try emailing us directly instead.';
          }
        });
    });
  });
}