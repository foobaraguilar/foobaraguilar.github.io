/**
 * Likes + comments live in the visitor’s browser (localStorage), not in this repo.
 * Site owner: to remove a comment, open DevTools → Application → Local Storage →
 * key "sitePostEngagement:v1:" + page path → edit the JSON "comments" array (or delete the key).
 * There is no delete control in the UI for visitors.
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'sitePostEngagement:v1:';

  function storageKey() {
    return STORAGE_PREFIX + location.pathname;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(storageKey());
      if (!raw) return defaultState();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return defaultState();
      return {
        likes: Math.max(0, parseInt(data.likes, 10) || 0),
        userLiked: !!data.userLiked,
        comments: Array.isArray(data.comments)
          ? data.comments.filter(function (c) {
              return c && typeof c.text === 'string' && typeof c.ts === 'number';
            })
          : [],
      };
    } catch (e) {
      return defaultState();
    }
  }

  function defaultState() {
    return { likes: 0, userLiked: false, comments: [] };
  }

  function saveState(state) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (e) {
      /* quota or private mode */
    }
  }

  function formatCommentTime(ts) {
    try {
      return new Date(ts).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      return '';
    }
  }

  function renderComments(listEl, emptyEl, comments) {
    if (!listEl) return;
    listEl.innerHTML = '';
    var sorted = comments.slice().sort(function (a, b) {
      return a.ts - b.ts;
    });
    sorted.forEach(function (c) {
      var li = document.createElement('li');
      li.className = 'post-detail-comment-item';

      var p = document.createElement('p');
      p.className = 'post-detail-comment-text';
      p.textContent = c.text;

      var time = document.createElement('time');
      time.className = 'post-detail-comment-time';
      time.setAttribute('datetime', new Date(c.ts).toISOString());
      time.textContent = formatCommentTime(c.ts);

      li.appendChild(p);
      li.appendChild(time);
      listEl.appendChild(li);
    });

    if (emptyEl) {
      emptyEl.hidden = sorted.length > 0;
    }
  }

  function init() {
    var likeBtn = document.getElementById('post-like-btn');
    var countEl = document.getElementById('post-likes-count');
    var form = document.getElementById('post-comment-form');
    var input = document.getElementById('post-comment-input');
    var listEl = document.getElementById('post-comment-list');
    var emptyEl = document.getElementById('post-comment-empty');

    var state = loadState();

    if (likeBtn && countEl) {
      function applyLikeUI() {
        countEl.textContent = String(state.likes);
        likeBtn.setAttribute('aria-pressed', state.userLiked ? 'true' : 'false');
        likeBtn.disabled = state.userLiked;
        likeBtn.classList.toggle('post-detail-like-btn--liked', state.userLiked);
      }

      applyLikeUI();

      likeBtn.addEventListener('click', function () {
        if (state.userLiked) return;
        state.userLiked = true;
        state.likes += 1;
        saveState(state);
        applyLikeUI();
      });
    }

    renderComments(listEl, emptyEl, state.comments);

    if (form && input) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = (input.value || '').trim();
        if (!text) return;
        state.comments.push({ text: text, ts: Date.now() });
        saveState(state);
        input.value = '';
        renderComments(listEl, emptyEl, state.comments);
        input.focus();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
