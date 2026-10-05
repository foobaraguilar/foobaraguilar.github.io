(function () {
  'use strict';
  var form = document.getElementById('post-password-form');
  var status = document.getElementById('post-password-status');
  var input = document.getElementById('post-password');
  var button = form.querySelector('button');
  var caps = document.getElementById('caps-lock');
  var capsLocked = false;
  function updateCaps(e) {
    // Letter and editing events must not reset mobile keyboard state.
    if (e.key !== 'CapsLock' && e.key !== 'Shift') return;
    capsLocked = e.getModifierState('CapsLock');
    caps.hidden = !(capsLocked || e.shiftKey);
  }
  input.addEventListener('keydown', updateCaps);
  input.addEventListener('keyup', updateCaps);
  input.addEventListener('input', function (e) {
    // Mobile keyboards often report inserted text instead of modifier keys.
    var letter = e.data && Array.from(e.data).pop();
    if (letter && letter.toLowerCase() !== letter.toUpperCase()) {
      caps.hidden = !(capsLocked || letter === letter.toUpperCase());
    }
  });
  var payload = JSON.parse(document.getElementById('post-encrypted-content').textContent);

  var dialog = document.querySelector('.post-password-gate');
  document.body.classList.add('post-password-locked');
  dialog.show();
  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
  });

  function decode(value) {
    return Uint8Array.from(atob(value), function (c) { return c.charCodeAt(0); });
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!window.crypto || !window.crypto.subtle) {
      status.textContent = 'Open this page over HTTPS or localhost to unlock it.';
      return;
    }
    button.disabled = true;
    status.textContent = '';
    try {
      var material = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(input.value), 'PBKDF2', false, ['deriveKey']
      );
      var key = await crypto.subtle.deriveKey(
        {name: 'PBKDF2', salt: decode(payload.salt), iterations: payload.iterations, hash: 'SHA-256'},
        material, {name: 'AES-GCM', length: 256}, false, ['decrypt']
      );
      var plaintext = await crypto.subtle.decrypt(
        {name: 'AES-GCM', iv: decode(payload.iv)}, key, decode(payload.data)
      );
      document.getElementById('post-unlocked-content').innerHTML = new TextDecoder().decode(plaintext);
      input.value = '';
      document.body.classList.remove('post-password-locked');
      dialog.close();
      dialog.remove();
      var interactions = document.createElement('script');
      interactions.src = '../assets/post-interactions.js';
      document.body.appendChild(interactions);
    } catch (error) {
      status.textContent = 'Incorrect password. Please try again.';
      input.focus();
      input.select();
    } finally {
      button.disabled = false;
    }
  });
})();
