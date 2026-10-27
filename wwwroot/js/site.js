/*
  Portfolio behaviour. jQuery + a couple of IntersectionObservers.
  Rule of thumb for this file: the page has to make sense before any of
  this runs, so everything here is an enhancement on top of plain HTML.
*/
(function ($) {
  'use strict';

  var $html = $(document.documentElement);
  var $announcer = $('#announcer');
  var hasIO = 'IntersectionObserver' in window;

  function motionOn() {
    return $html.attr('data-motion') !== 'reduced';
  }

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  // Clearing first makes screen readers re-read the same text twice in a row.
  function announce(message) {
    $announcer.text('');
    window.setTimeout(function () { $announcer.text(message); }, 80);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  // Move focus somewhere that isn't normally focusable (a section, a message box).
  function focusBlock($el) {
    if (!$el.length) return;
    if (!$el.is('[tabindex], a[href], button, input, select, textarea')) $el.attr('tabindex', '-1');
    $el[0].focus({ preventScroll: true });
  }


  /* ---------- theme + motion switches ---------- */

  var prefs = {
    init: function () {
      this.$theme = $('#theme-toggle');
      this.$motion = $('#motion-toggle');
      this.sync();

      this.$theme.on('click', function () {
        var dark = $html.attr('data-theme') !== 'dark';
        $html.attr('data-theme', dark ? 'dark' : 'light');
        store('nm-theme', dark ? 'dark' : 'light');
        prefs.sync();
        announce(dark ? 'Dark theme on' : 'Light theme on');
      });

      this.$motion.on('click', function () {
        var reduce = motionOn();
        $html.attr('data-motion', reduce ? 'reduced' : 'full');
        store('nm-motion', reduce ? 'reduced' : 'full');
        prefs.sync();
        $(document).trigger('motion:change', [!reduce]);
        announce(reduce ? 'Animations off' : 'Animations on');
      });
    },

    sync: function () {
      this.$theme.attr('aria-pressed', String($html.attr('data-theme') === 'dark'));
      this.$motion.attr('aria-pressed', String(!motionOn()));
    }
  };


  /* ---------- header nav: in-page links, active section, progress ---------- */

  var nav = {
    init: function () {
      this.$links = $('.site-nav .nav-link');
      this.$collapse = $('#site-nav');

      // In-page links: scroll, then move focus to the section so the next Tab
      // continues from there instead of jumping back to the header.
      $(document).on('click', 'a[href*="#"]', function (e) {
        var url = new URL(this.href, location.href);
        if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;

        var $target = $(url.hash);
        if (!$target.length) return;

        e.preventDefault();
        nav.closeMenu();
        $target[0].scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'start' });
        history.pushState(null, '', url.hash);
        focusBlock($target);
      });

      if (hasIO) this.watchSections();
      this.progress();
    },

    closeMenu: function () {
      if (this.$collapse.hasClass('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(this.$collapse[0], { toggle: false }).hide();
      }
    },

    watchSections: function () {
      var $links = this.$links;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          $links.removeAttr('aria-current');
          $links.filter('[href$="#' + id + '"]').attr('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      $('main section[id]').each(function () { observer.observe(this); });
    },

    progress: function () {
      var bar = document.querySelector('.read-progress__bar');
      var $top = $('#to-top');
      var ticking = false;
      var topShown = false;

      function update() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var y = window.scrollY;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';

        var wantTop = y > 900;
        if (wantTop !== topShown) {
          topShown = wantTop;
          if (wantTop) {
            $top.prop('hidden', false);
            $top[0].offsetWidth; // reflow so the slide-in actually transitions
            $top.removeClass('is-tucked');
          } else {
            $top.addClass('is-tucked');
            setTimeout(function () { if (!topShown) $top.prop('hidden', true); }, 300);
          }
        }
        ticking = false;
      }

      $(window).on('scroll resize', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      });
      $top.addClass('is-tucked');
      update();

      $top.on('click', function () {
        window.scrollTo({ top: 0, behavior: motionOn() ? 'smooth' : 'auto' });
        focusBlock($('#main'));
      });
    }
  };


  /* ---------- hero: keyboard + screen reader demo ---------- */

  var demo = {
    STEP_MS: 3400,

    init: function () {
      this.$root = $('.kbd-demo');
      if (!this.$root.length) return;

      this.$form = this.$root.find('.kbd-demo__form');
      this.$stops = this.$root.find('.demo-stop');
      this.$ring = this.$root.find('.demo-ring');
      this.$key = this.$root.find('.demo-key');
      this.$said = $('#demo-said');
      this.$play = $('#demo-play').prop('hidden', false);
      this.$next = $('#demo-next').prop('hidden', false);

      this.index = 0;
      this.playing = false;
      this.visible = true;

      this.show(0, false);

      var self = this;
      this.$play.on('click', function () {
        self.playing ? self.pause() : self.play(true);
      });
      this.$next.on('click', function () {
        self.pause();
        self.show((self.index + 1) % self.$stops.length, motionOn());
        announce('Stop ' + (self.index + 1) + ' of ' + self.$stops.length + '. Screen reader says: ' +
          self.$stops.eq(self.index).data('say'));
      });

      $(window).on('resize', debounce(function () { self.placeRing(false); }, 150));

      $(document).on('motion:change', function (e, on) {
        if (on) { self.play(); } else { self.pause(); self.placeRing(false); }
      });

      // Don't burn CPU (or distract) when nobody can see it.
      if (hasIO) {
        new IntersectionObserver(function (entries) {
          self.visible = entries[0].isIntersecting;
          if (!self.visible) clearTimeout(self.timer);
          else if (self.playing) self.queue();
        }).observe(this.$root[0]);
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearTimeout(self.timer);
        else if (self.playing) self.queue();
      });

      // Wait for the focus ring on the name to finish before starting.
      if (motionOn()) {
        setTimeout(function () { self.play(); }, 2700);
      } else {
        this.setPlayLabel();
      }
    },

    play: function (fromButton) {
      if (!motionOn() && !fromButton) return;
      this.playing = true;
      this.setPlayLabel();
      this.queue();
    },

    pause: function () {
      this.playing = false;
      clearTimeout(this.timer);
      this.setPlayLabel();
    },

    queue: function () {
      var self = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        if (!self.playing || !self.visible) return;
        self.show((self.index + 1) % self.$stops.length, motionOn());
        self.queue();
      }, this.STEP_MS);
    },

    setPlayLabel: function () {
      this.$play.text(this.playing ? 'Pause demo' : 'Play demo');
    },

    show: function (i, animate) {
      this.index = i;
      var $stop = this.$stops.removeClass('is-current').eq(i).addClass('is-current');

      this.placeRing(animate);
      this.speak(String($stop.data('say')), animate);

      if (animate) {
        // restart the key-press animation
        this.$key.removeClass('is-pressed');
        this.$key[0].offsetWidth;
        this.$key.addClass('is-pressed');
      }
    },

    // The ring wraps the control itself, not the label.
    placeRing: function (animate) {
      var $stop = this.$stops.eq(this.index);
      var $target = $stop.find('.demo-input, .demo-radio.is-checked, .demo-button').first();
      if (!$target.length) $target = $stop;

      var formBox = this.$form[0].getBoundingClientRect();
      var box = $target[0].getBoundingClientRect();
      var pad = 5;

      this.$ring
        .toggleClass('no-anim', !animate)
        .addClass('is-on')
        .css({
          width: box.width + pad * 2,
          height: box.height + pad * 2,
          transform: 'translate(' + (box.left - formBox.left - pad) + 'px,' + (box.top - formBox.top - pad) + 'px)'
        });
    },

    speak: function (text, animate) {
      var $said = this.$said;
      clearInterval(this.typer);

      if (!animate) {
        $said.removeClass('is-typing').text(text);
        return;
      }

      var n = 0;
      $said.addClass('is-typing').text('');
      this.typer = setInterval(function () {
        n += 2;
        $said.text(text.slice(0, n));
        if (n >= text.length) {
          clearInterval(demo.typer);
          $said.removeClass('is-typing');
        }
      }, 28);
    }
  };


  /* ---------- experience: ARIA tabs ---------- */

  function initTabs() {
    $('[data-tabs]').each(function () {
      var $wrap = $(this);
      var $list = $wrap.find('[role="tablist"]');
      var $tabs = $list.find('[role="tab"]');
      var $marker = $list.find('.jobs__marker');
      var $panels = $tabs.map(function () {
        return document.getElementById(this.getAttribute('aria-controls'));
      });

      $wrap.addClass('is-tabs');
      $list.prop('hidden', false);

      $panels.each(function (i) {
        $(this).attr({ role: 'tabpanel', 'aria-labelledby': $tabs[i].id, tabindex: '0' })
               .prop('hidden', i !== 0);
      });

      function moveMarker() {
        var tab = $tabs.filter('[aria-selected="true"]')[0];
        if (!tab) return;
        $marker.css({ height: tab.offsetHeight, transform: 'translateY(' + tab.offsetTop + 'px)' });
      }

      function select(i, setFocus) {
        var $tab = $tabs.eq(i);
        if ($tab.attr('aria-selected') === 'true') {
          if (setFocus) $tab.trigger('focus');
          return;
        }

        $tabs.attr({ 'aria-selected': 'false', tabindex: '-1' });
        $tab.attr({ 'aria-selected': 'true', tabindex: '0' });
        if (setFocus) $tab.trigger('focus');

        $panels.prop('hidden', true).removeClass('is-entering');
        var $panel = $($panels[i]).prop('hidden', false);
        if (motionOn()) $panel.addClass('is-entering');

        moveMarker();
      }

      $tabs.on('click', function () { select($tabs.index(this), true); });

      $tabs.on('keydown', function (e) {
        var i = $tabs.index(this);
        var last = $tabs.length - 1;
        var next = null;

        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight': next = i === last ? 0 : i + 1; break;
          case 'ArrowUp':
          case 'ArrowLeft': next = i === 0 ? last : i - 1; break;
          case 'Home': next = 0; break;
          case 'End': next = last; break;
        }

        if (next !== null) {
          e.preventDefault();
          select(next, true);
        }
      });

      $(window).on('resize', debounce(moveMarker, 120));
      moveMarker();
    });
  }


  /* ---------- selected work: disclosures ---------- */

  function initCases() {
    $('.case').each(function () {
      var $case = $(this).addClass('is-ready');
      var $btn = $case.find('.case__toggle');
      var $body = $case.find('.case__body');

      $btn.prop('hidden', false).attr('aria-expanded', 'false');
      $body.addClass('is-collapsed');

      $btn.on('click', function () {
        var open = $btn.attr('aria-expanded') === 'true';
        $btn.attr('aria-expanded', String(!open));
        $body.toggleClass('is-collapsed', open);
      });
    });
  }


  /* ---------- accessibility checklist ticks ---------- */

  function initChecklist() {
    var $items = $('.checklist__item');
    if (!$items.length) return;

    if (!hasIO || !motionOn()) {
      $items.addClass('is-checked');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('is-checked');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    $items.each(function () { observer.observe(this); });

    $(document).on('motion:change', function () { $items.addClass('is-checked'); });
  }


  /* ---------- skills filter ---------- */

  function initSkills() {
    var $filter = $('.skill-filter');
    if (!$filter.length) return;

    var $buttons = $filter.find('[data-filter]');
    var $groups = $('.skill-group');
    $filter.prop('hidden', false);

    $buttons.on('click', function () {
      var key = $(this).data('filter');
      var label = $.trim($(this).text());
      $buttons.attr('aria-pressed', 'false');
      $(this).attr('aria-pressed', 'true');

      var count = 0;
      $groups.each(function () {
        var $g = $(this);
        var match = key === 'all' || $g.data('group') === key;
        if (match) {
          count += $g.find('li').length;
          var wasHidden = $g.prop('hidden');
          $g.prop('hidden', false).removeClass('is-hiding');
          if (wasHidden && motionOn()) {
            $g.addClass('is-showing');
            setTimeout(function () { $g.removeClass('is-showing'); }, 600);
          }
        } else if (!$g.prop('hidden')) {
          if (motionOn()) {
            $g.addClass('is-hiding');
            setTimeout(function () {
              if ($g.hasClass('is-hiding')) $g.prop('hidden', true).removeClass('is-hiding');
            }, 250);
          } else {
            $g.prop('hidden', true);
          }
        }
      });

      announce(key === 'all'
        ? 'Showing all ' + count + ' skills'
        : 'Showing ' + count + ' ' + label + ' skills');
    });
  }


  /* ---------- contact form ---------- */

  function initContact() {
    var $form = $('.contact-form');
    if (!$form.length) return;

    var $summary = $('#error-summary');
    var $summaryList = $summary.find('.error-summary__list');
    var $message = $('#Message');
    var $count = $('#Message-count');
    var max = parseInt($message.attr('maxlength'), 10) || 1500;
    var warned = { near: false, full: false };

    // jQuery Validate adds its own "<name>-error" id to aria-describedby, so drop
    // the empty server-side container from it to avoid reading errors twice.
    $form.find('.field__input').each(function () {
      var $input = $(this);
      var msgId = this.id + '-msg';
      if ($.trim($('#' + msgId).text()) !== '') return;
      var ids = ($input.attr('aria-describedby') || '').split(/\s+/).filter(function (id) {
        return id && id !== msgId;
      });
      ids.length ? $input.attr('aria-describedby', ids.join(' ')) : $input.removeAttr('aria-describedby');
    });

    function updateCount() {
      var left = max - $message.val().length;
      $count.text($message.val().length.toLocaleString() + ' / ' + max.toLocaleString())
            .toggleClass('is-near', left <= 100);

      if (left <= 100 && !warned.near) { warned.near = true; announce(left + ' characters left'); }
      if (left === 0 && !warned.full) { warned.full = true; announce('Character limit reached'); }
      if (left > 100) warned.near = warned.full = false;
    }
    $message.on('input', updateCount);
    updateCount();

    // Only validate on blur once the form has been submitted. Errors popping in
    // while someone is still tabbing through are noisy for screen reader users,
    // and the inserted message can shove the submit button out from under the
    // mouse between mousedown and click.
    var validator = $form.data('validator');
    if (validator) {
      // We move focus to the error summary ourselves.
      validator.settings.focusInvalid = false;
      validator.settings.onfocusout = function (element) {
        if (element.name in this.submitted) this.element(element);
      };

      // jQuery Validate only sets aria-invalid when a single field is checked,
      // not on a full submit, so keep it in step with the visual state here.
      var highlight = validator.settings.highlight;
      var unhighlight = validator.settings.unhighlight;
      validator.settings.highlight = function (element) {
        highlight.apply(this, arguments);
        element.setAttribute('aria-invalid', 'true');
      };
      validator.settings.unhighlight = function (element) {
        unhighlight.apply(this, arguments);
        element.setAttribute('aria-invalid', 'false');
      };
    }

    function showSummary(errors) {
      $summaryList.empty();
      errors.forEach(function (err) {
        $('<li>').append(
          $('<a>', { href: '#' + err.id, text: err.text })
        ).appendTo($summaryList);
      });
      $summary.prop('hidden', false);
      $summary[0].scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'center' });
      focusBlock($summary);
    }

    // Summary links put focus in the field and keep its label on screen.
    $summary.on('click', 'a', function (e) {
      var field = document.getElementById(this.getAttribute('href').slice(1));
      if (!field) return;
      e.preventDefault();
      $(field).closest('.field')[0].scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'center' });
      field.focus({ preventScroll: true });
    });

    $form.on('invalid-form.validate', function (e, validator) {
      var errors = validator.errorList.map(function (item) {
        return { id: item.element.id, text: item.message };
      });

      if (motionOn()) {
        validator.errorList.forEach(function (item) {
          var $field = $(item.element).closest('.field').removeClass('is-shaking');
          $field[0].offsetWidth;
          $field.addClass('is-shaking');
        });
      }
      showSummary(errors);
    });

    // jQuery Validate's own submit handler runs first and cancels the event when
    // something is wrong, so only show the busy state for submissions that go through.
    $form.on('submit', function (e) {
      if (e.isDefaultPrevented()) return;
      $summary.prop('hidden', true);
      $form.find('.button--submit').addClass('is-busy').attr('aria-disabled', 'true')
           .find('.button__label').text('Sending');
    });

    // After the server responds: either errors to fix or a thank-you.
    if (!$summary.prop('hidden')) {
      focusBlock($summary);
    }
    var $success = $('#form-success');
    if ($success.length) {
      $success[0].scrollIntoView({ block: 'center' });
      focusBlock($success);
    }
  }


  $(function () {
    prefs.init();
    nav.init();
    demo.init();
    initTabs();
    initCases();
    initChecklist();
    initSkills();
    initContact();
  });

})(jQuery);
