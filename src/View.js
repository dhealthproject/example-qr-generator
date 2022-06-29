/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
 class View {
  static mutateDOM(spec, animate = null, rmAnim = null) {
    const ids = Object.keys(spec);
    for (let i = 0, m = ids.length; i < m; i++) {
      const elm = document.getElementById(ids[i]);
      elm.innerHTML = spec[ids[i]]

      if (null !== animate && animate.length) {
        if (null !== rmAnim) elm.classList.toggle(rmAnim);
        let animated = animate;
        if (typeof animate !== 'string') {
          animate.map(a => elm.classList.toggle(a));
          animated = animate.join(' ');
        }
        else elm.classList.toggle(animate);
        setTimeout(() => elm.classList.value.replace(animated, ''), 3000)
      }
    }
  }

  static toggleModal(selector) {
    let modal = document.querySelector(selector),
        closers = document.querySelectorAll(selector + ' .modal-close');

    modal.classList.toggle('opacity-0');
    modal.classList.toggle('pointer-events-none');

    // if closing, done here.
    if (-1 < modal.classList.value.indexOf('opacity-0')) return false;

    for (let i = 0, m = closers.length; i < m; i++) {
      closers[i].addEventListener('click', (e) => {
        e.preventDefault();
        View.toggleModal(selector);
      });
    }
  }

  static toggleTooltip(selector) {
    let tooltip = document.querySelector(selector);
    tooltip.classList.toggle('hidden');
  }
}

window.YourDLT = Object.assign({}, window.YourDLT ?? {}, {
  View,
});
