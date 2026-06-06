/**
 * Floating sidebar drawers — desktop (≥ 1200 px)
 *
 * Left  → hamburger button (fixed, top-left of viewport)
 * Right → fixed chevron tab at right viewport edge
 * Backdrop → dims content when either sidebar is open
 * State persisted in localStorage.
 */

const HAMBURGER = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="currentColor">
  <rect x="0" y="0"  width="20" height="2.5" rx="1.25"/>
  <rect x="0" y="6.75" width="20" height="2.5" rx="1.25"/>
  <rect x="0" y="13.5" width="20" height="2.5" rx="1.25"/>
</svg>`

document.addEventListener("nav", () => {
  if (window.innerWidth < 1200) return

  const leftSidebar  = document.querySelector<HTMLElement>(".sidebar.left")
  const rightSidebar = document.querySelector<HTMLElement>(".sidebar.right")
  if (!leftSidebar || !rightSidebar) return

  // ── State — default collapsed (drawers start hidden) ─────────────
  // "0" means open; anything else (including null) means collapsed
  let leftCollapsed  = localStorage.getItem("sb-left")  !== "0"
  let rightCollapsed = localStorage.getItem("sb-right") !== "0"

  // ── Backdrop ──────────────────────────────────────────────────────
  const getBackdrop = (): HTMLElement => {
    let bd = document.getElementById("sb-backdrop") as HTMLElement | null
    if (!bd) {
      bd = document.createElement("div")
      bd.id        = "sb-backdrop"
      bd.className = "sb-backdrop"
      document.body.appendChild(bd)
    }
    return bd
  }

  // ── Hamburger (fixed, top-left) ───────────────────────────────────
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

  // ── Right chevron tab (fixed at right viewport edge) ─────────────
  const getRightChevron = (): HTMLButtonElement => {
    let btn = document.getElementById("sb-right-chevron") as HTMLButtonElement | null
    if (!btn) {
      btn = document.createElement("button")
      btn.id        = "sb-right-chevron"
      btn.className = "sb-right-chevron"
      btn.setAttribute("aria-label", "Toggle table of contents")
      document.body.appendChild(btn)
    }
    return btn
  }

  const backdrop     = getBackdrop()
  const hamburger    = getHamburger()
  const rightChevron = getRightChevron()

  // ── Apply state ───────────────────────────────────────────────────
  const applyLayout = () => {
    leftSidebar.classList.toggle("sb-collapsed",  leftCollapsed)
    rightSidebar.classList.toggle("sb-collapsed", rightCollapsed)

    // body class used by CSS to slide the right chevron tab
    document.body.classList.toggle("sb-right-open", !rightCollapsed)

    // Backdrop active when either sidebar is open
    const anyOpen = !leftCollapsed || !rightCollapsed
    backdrop.classList.toggle("active", anyOpen)

    // Right chevron icon + tooltip
    rightChevron.textContent = rightCollapsed ? "›" : "‹"
    rightChevron.title       = rightCollapsed ? "Open contents" : "Close contents"
  }

  // ── Click handlers ────────────────────────────────────────────────
  const onHamburger = () => {
    leftCollapsed = !leftCollapsed
    localStorage.setItem("sb-left", leftCollapsed ? "1" : "0")
    applyLayout()
  }

  const onRightChevron = () => {
    rightCollapsed = !rightCollapsed
    localStorage.setItem("sb-right", rightCollapsed ? "1" : "0")
    applyLayout()
  }

  const onBackdrop = () => {
    if (!leftCollapsed)  { leftCollapsed  = true; localStorage.setItem("sb-left",  "1") }
    if (!rightCollapsed) { rightCollapsed = true; localStorage.setItem("sb-right", "1") }
    applyLayout()
  }

  hamburger.addEventListener("click",    onHamburger)
  rightChevron.addEventListener("click", onRightChevron)
  backdrop.addEventListener("click",     onBackdrop)

  window.addCleanup(() => {
    hamburger.removeEventListener("click",    onHamburger)
    rightChevron.removeEventListener("click", onRightChevron)
    backdrop.removeEventListener("click",     onBackdrop)
  })

  // ── Hide both buttons on mobile / tablet ─────────────────────────
  const onResize = () => {
    const desktop = window.innerWidth >= 1200
    hamburger.style.display    = desktop ? "" : "none"
    rightChevron.style.display = desktop ? "" : "none"
  }
  window.addEventListener("resize", onResize)
  window.addCleanup(() => window.removeEventListener("resize", onResize))

  // ── Initial render ────────────────────────────────────────────────
  applyLayout()
  hamburger.style.display    = ""
  rightChevron.style.display = ""
})
