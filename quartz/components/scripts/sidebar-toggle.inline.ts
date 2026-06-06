/**
 * Collapsible sidebars — desktop (≥ 1200 px)
 *
 * Left  → hamburger button (fixed, top-left of viewport)
 * Right → chevron button prepended inside the right sidebar
 * Grid column widths are animated via JS; sidebars stay in flow.
 * State persisted in localStorage.
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
  const rightSidebar = document.querySelector<HTMLElement>(".sidebar.right")
  if (!quartzBody || !leftSidebar || !rightSidebar) return

  // ── State ─────────────────────────────────────────────────────────
  // "0" = expanded, anything else (including null) = collapsed (content-first default)
  let leftCollapsed  = localStorage.getItem("sb-left")  !== "0"
  let rightCollapsed = localStorage.getItem("sb-right") !== "0"

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

  // ── Right-sidebar chevron (prepended inside the right sidebar) ─────
  const getRightChevron = (): HTMLButtonElement => {
    let btn = rightSidebar.querySelector<HTMLButtonElement>(".sb-right-chevron")
    if (!btn) {
      btn = document.createElement("button")
      btn.className = "sb-right-chevron"
      btn.setAttribute("aria-label", "Toggle table of contents")
      rightSidebar.prepend(btn)
    }
    return btn
  }

  const hamburger    = getHamburger()
  const rightChevron = getRightChevron()

  // ── Apply layout ───────────────────────────────────────────────────
  // Grid column widths are changed directly; sidebars stay in flow.
  // Left collapsed → 0px. Right collapsed → 44px (chevron still visible).
  const applyLayout = (animate: boolean) => {
    if (!animate) quartzBody.style.transition = "none"

    const lw = leftCollapsed  ? 0  : 320
    const rw = rightCollapsed ? 44 : 320
    quartzBody.style.gridTemplateColumns = `${lw}px auto ${rw}px`

    leftSidebar.classList.toggle("sb-collapsed",  leftCollapsed)
    rightSidebar.classList.toggle("sb-collapsed", rightCollapsed)

    // Body classes for CSS hooks (centering article when sidebars hidden)
    document.body.classList.toggle("sb-left-hidden",  leftCollapsed)
    document.body.classList.toggle("sb-right-hidden", rightCollapsed)

    // Chevron icon + tooltip
    rightChevron.textContent = rightCollapsed ? "›" : "‹"
    rightChevron.title       = rightCollapsed ? "Expand sidebar" : "Collapse sidebar"

    if (!animate) {
      requestAnimationFrame(() => {
        quartzBody.style.transition = "grid-template-columns 0.32s ease"
      })
    }
  }

  // ── Click handlers ─────────────────────────────────────────────────
  const onHamburger = () => {
    leftCollapsed = !leftCollapsed
    localStorage.setItem("sb-left", leftCollapsed ? "1" : "0")
    applyLayout(true)
  }
  const onRightChevron = () => {
    rightCollapsed = !rightCollapsed
    localStorage.setItem("sb-right", rightCollapsed ? "1" : "0")
    applyLayout(true)
  }

  hamburger.addEventListener("click",    onHamburger)
  rightChevron.addEventListener("click", onRightChevron)

  window.addCleanup(() => {
    hamburger.removeEventListener("click",    onHamburger)
    rightChevron.removeEventListener("click", onRightChevron)
  })

  // ── Hide on mobile / tablet ────────────────────────────────────────
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
