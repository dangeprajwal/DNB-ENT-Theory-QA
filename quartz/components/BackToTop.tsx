import { QuartzComponent, QuartzComponentConstructor } from "./types"

const BackToTop: QuartzComponent = () => {
  return (
    <button
      class="back-to-top"
      aria-label="Back to top"
      id="back-to-top"
      type="button"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  )
}

BackToTop.css = `
.back-to-top {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 9998;
  width: 44px;
  height: 44px;
  display: none;
  align-items: center;
  justify-content: center;
  background: var(--secondary);
  color: var(--light);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.18s ease, transform 0.18s ease, background 0.15s ease;
}
.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}
.back-to-top:hover { background: var(--tertiary); }
.back-to-top:active { transform: scale(0.95); }

@media (max-width: 800px) {
  .back-to-top.visible { display: flex; }
}
`

BackToTop.afterDOMLoaded = `
(function(){
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  function toggle() {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
`

export default (() => BackToTop) satisfies QuartzComponentConstructor
