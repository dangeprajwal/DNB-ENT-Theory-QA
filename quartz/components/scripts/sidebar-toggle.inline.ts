/**
 * Collapsible left sidebar — desktop (≥ 1200 px)
 *
 * Left  → hamburger button (fixed, top-left of viewport)
 * Right → always visible at 320px, no toggle
 * Grid column widths are animated via JS; sidebars stay in flow.
 * Left state persisted in localStorage.
 */

const HAMBURGER = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="currentColor">
  <rect x="0" y="0"  width="20" height="2.5" rx="1.25"/>
  <rect x="0" y="6.75" width="20" height="2.5" rx="1.25"/>
  <rect x="0" y="13.5" width="20" height="2.5" rx="1.25"/>
</svg>`

document.addEventListener("nav", () => {
  if (window.innerWidth < 1200) return

  const quartzBody   = document.getElementById("quartz-body") as HTMLElement | null
  const leftSidebar  = document.querySelector<HTMLElement>(".sidebar.left")
  if (!quartzBody || !leftSidebar) return

  // ── State ─────────────────────────────────────────────────────────
  // "0" = expanded, anything else (including null) = collapsed (content-first default)
  let leftCollapsed = localStorage.getItem("sb-left") !== "0"

  // ── Hamburger (fixed, top-left, always outside the grid) ──────────
  const getHamburger = (): HTMLButtonElement => {
    let btn = document.getElementById("sb-hamburger") as HTMLButtonElement | null
    if (!btn) {
      btn = document.createElement("button")
      btn.id        = "sb-hamburger"
      btn.className = "sb-hamburger"
      btn.setAttribute("aria-label", "Toggle navigation")
      document.body.appendChild(btn)
    }
    btn.innerHTML = HAMBURGER
    return btn
  }

  const hamburger = getHamburger()

  // ── Apply layout ───────────────────────────────────────────────────
  // Right sidebar is always 320px. Only left sidebar toggles.
  const applyLayout = (animate: boolean) => {
    if (!animate) quartzBody.style.transition = "none"

    const lw = leftCollapsed ? 0 : 320
    quartzBody.style.gridTemplateColumns = `${lw}px auto 320px`

    leftSidebar.classList.toggle("sb-collapsed", leftCollapsed)
    document.body.classList.toggle("sb-left-hidden", leftCollapsed)

    if (!animate) {
      requestAnimationFrame(() => {
        quartzBody.style.transition = "grid-template-columns 0.32s ease"
      })
    }
  }

  // ── Click handler ──────────────────────────────────────────────────
  const onHamburger = () => {
    leftCollapsed = !leftCollapsed
    localStorage.setItem("sb-left", leftCollapsed ? "1" : "0")
    applyLayout(true)
  }

  hamburger.addEventListener("click", onHamburger)
  window.addCleanup(() => hamburger.removeEventListener("click", onHamburger))

  // ── Hide hamburger on mobile / tablet ──────────────────────────────
  const onResize = () => {
    const desktop = window.innerWidth >= 1200
    hamburger.style.display = desktop ? "" : "none"
  }
  window.addEventListener("resize", onResize)
  window.addCleanup(() => window.removeEventListener("resize", onResize))

  // ── Initial render (no animation to avoid FOUC) ────────────────────
  quartzBody.style.transition = "none"
  applyLayout(false)
  hamburger.style.display = ""
})
