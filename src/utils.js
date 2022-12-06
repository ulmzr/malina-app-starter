function removeProps(e) {
   e.removeProperty('height');
   e.removeProperty('overflow');
   e.removeProperty('transition-property');
   e.removeProperty('transition-duration');
   e.removeProperty('transition-timing-function');
}

export function randomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

export const colorStyle = {
   primary: '#4A89DC',
   info: '#3BAFDA',
   success: '#8CC152',
   warning: '#F6BB42',
   error: ' #DA4453',
   dark: '#434A54',
};

export function colour(color) {
   if (!color.includes('|')) return [color, null];
   let arrColor = color.split('|');
   color = colorStyle[arrColor[0]] || arrColor[0];
   let hoverColor = colorStyle[arrColor[1]] || arrColor[1];
   return [color, hoverColor];
}
export function toggleAttr(e = document.body, attr = '_') {
   if (e.hasAttribute(attr)) e.removeAttribute(attr);
   else e.setAttribute(attr, '');
}

export const uuid = (n = 6) =>
   'm' +
   Array.from(Array(n), () => Math.floor(Math.random() * 36).toString(36)).join(
      ''
   );

export function runtimeStyle(e, uid, str) {
   const head = document.querySelector('head');
   if (!head) return;

   let runtime = head.querySelector('#runtime');
   if (!runtime) {
      runtime = document.createElement('style');
      runtime.id = 'runtime';
      head.appendChild(runtime);
   }

   if (uid) {
      if (runtime.textContent.includes(uid)) return;
   }

   const styleNode = document.createTextNode(str);
   runtime.appendChild(styleNode);

   e.setAttribute(uid);
}

// slider

export function slideDown(e, duration = 300) {
   e.style.removeProperty('display');

   let display = window.getComputedStyle(e).display;

   if (display === 'none') {
      display = 'block';
   }

   e.style.display = display;
   const height = e.offsetHeight;

   e.style.overflow = 'hidden';
   e.style.height = 0;

   e.offsetHeight;

   e.style.height = height + 'px';
   e.style.transitionProperty = 'padding, height, visibility, opacity';
   e.style.transitionDuration = duration + 'ms';
   e.style.transitionTimingFunction = 'ease-in-out';

   setTimeout(() => {
      removeProps(e.style);
   }, duration);
}

export function slideUp(e, duration = 300) {
   e.style.transitionProperty = 'padding, height, visibility, opacity';
   e.style.transitionDuration = duration + 'ms';
   e.style.height = e.offsetHeight + 'px';

   e.offsetHeight;

   e.style.overflow = 'hidden';
   e.style.height = 0;

   setTimeout(() => {
      e.style.display = 'none';
      removeProps(e.style);
   }, duration);
}

export function toggleSlide(e, duration) {
   if (getComputedStyle(e).display === 'none') return slideDown(e, duration);
   else return slideUp(e, duration);
}

// end of slider

export function getElementStyle(props) {
   const dummy = document.createElement('div');
   for (const [key, value] of Object.entries(props)) {
      dummy.style[key] = value;
   }
   return dummy.getAttribute('style');
}

export function setElementStyle(e, props) {
   if (!e) return;
   const style = getElementStyle(props);
   e.setAttribute('style', style);
}

export function updateElementStyle(e, props, update) {
   Object.assign(props, {
      ...update,
   });
   setElementStyle(e, props);
}
