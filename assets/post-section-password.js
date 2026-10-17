(function () {
  'use strict';
  var payloadNode = document.getElementById('post-encrypted-sections');
  if (!payloadNode) return;
  var payload = JSON.parse(payloadNode.textContent);
  var sections = Array.from(document.querySelectorAll('[data-password-section]'));
  var controls = sections.map(function (section) {
    var form = section.querySelector('form');
    return {
      section: section,
      form: form,
      input: form.querySelector('input'),
      button: form.querySelector('button'),
      status: section.querySelector('[data-password-status]'),
    };
  });
  var storageKey = 'article-unlock:' + location.pathname + ':' + payload.salt;
  var busy = false;
  var unlocked = false;

  function decode(value) {
    return Uint8Array.from(atob(value), function (c) { return c.charCodeAt(0); });
  }

  function setBusy(value) {
    busy = value;
    controls.forEach(function (control) { control.button.disabled = value; });
  }

  async function unlock(key, activeSection) {
    var plaintext = await crypto.subtle.decrypt(
      {name: 'AES-GCM', iv: decode(payload.iv)}, key, decode(payload.data)
    );
    var fragments = JSON.parse(new TextDecoder().decode(plaintext));
    // Validate every section before revealing either one.
    sections.forEach(function (section) {
      if (typeof fragments[section.getAttribute('data-password-section')] !== 'string') {
        throw new Error('Missing protected section.');
      }
    });
    sections.forEach(function (section) {
      var content = section.querySelector('[data-password-content]');
      content.innerHTML = fragments[section.getAttribute('data-password-section')];
      content.hidden = false;
      section.querySelector('[data-password-gate]').remove();
      section.querySelector('[data-password-preview]').remove();
      section.classList.remove('is-locked');
    });
    controls.forEach(function (control) { control.input.value = ''; });
    unlocked = true;
    if (activeSection) {
      var activeContent = activeSection.querySelector('[data-password-content]');
      activeContent.setAttribute('tabindex', '-1');
      activeContent.focus({preventScroll: true});
    }
  }

  controls.forEach(function (control) {
    control.form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (busy || unlocked) return;
      if (!window.crypto || !window.crypto.subtle) {
        control.status.textContent = 'Open this page over HTTPS or localhost to unlock it.';
        return;
      }
      setBusy(true);
      controls.forEach(function (item) { item.status.textContent = ''; });
      try {
        var material = await crypto.subtle.importKey(
          'raw', new TextEncoder().encode(control.input.value), 'PBKDF2', false, ['deriveKey']
        );
        var key = await crypto.subtle.deriveKey(
          {name: 'PBKDF2', salt: decode(payload.salt), iterations: payload.iterations, hash: 'SHA-256'},
          material, {name: 'AES-GCM', length: 256}, true, ['decrypt']
        );
        await unlock(key, control.section);
        try {
          var raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
          localStorage.setItem(storageKey, btoa(String.fromCharCode.apply(null, raw)));
        } catch (_) {}
      } catch (error) {
        control.status.textContent = 'Incorrect password. Please try again.';
        control.input.focus();
        control.input.select();
      } finally {
        setBusy(false);
      }
    });
  });

  (async function restoreUnlock() {
    setBusy(true);
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved) {
        var key = await crypto.subtle.importKey('raw', decode(saved), 'AES-GCM', false, ['decrypt']);
        await unlock(key);
      }
    } catch (_) {
      try { localStorage.removeItem(storageKey); } catch (_) {}
    } finally {
      setBusy(false);
    }
  })();
})();
