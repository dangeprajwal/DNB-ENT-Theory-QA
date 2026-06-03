/**
 * Collapsible sidebars for desktop (≥1200px)
 * Injects fixed toggle buttons at the sidebar/content boundary.
 * State is persisted in localStorage.
 */

const COLLAPSED_W = 44   // px width of collapsed sidebar
const EXPANDED_W  = 320  // must match $sidePanelWidth in variables.scss

function positionButtons(
  leftBtn: HTMLElement,
  rightBtn: HTMLElement,
  leftSidebar: HTMLElement,
  rightSidebar: HTMLElement,
) {
  requestAnimationFrame(() => {
    const lRect = leftSidebar.getBoundingClientRect()
    const rRect = rightSidebar.getBoundingClientRect()
    leftBtn.style.left  = `${lRect.right - 14}px`
    rightBtn.style.right = `${window.innerWidth - rRect.left - 14}px`
  })
}

document.addEventListener("nav", () => {
  if (window.innerWidth < 1200) return

  const quartzBody = document.getElementById("quartz-body") as HTMLElement | null
  const leftSidebar  = document.querySelector<HTMLElement>(".sidebar.left")
  const rightSidebar = document.querySelector<HTMLElement>(".sidebar.right")
  if (!quartzBody || !leftSidebar || !rightSidebar) return

  // ── state ──────────────────────────────────────────────────────────────
  let leftCollapsed  = localStorage.getItem("sb-left")  === "1"
  let rightCollapsed = localStorage.getItem("sb-right") === "1"

  // ── ensure transition is set ───────────────────────────────────────────
  quartzBody.style.transition = "grid-template-columns 0.3s ease"

  // ── helper: apply grid + classes ───────────────────────────────────────
  const applyLayout = (animate: boolean) => {
    if (!animate) quartzBody.style.transition = "none"

    const lw = leftCollapsed  ? COLLAPSED_W : EXPANDED_W
    const rw = rightCollapsed ? COLLAPSED_W : EXPANDED_W
    quartzBody.style.gridTemplateColumns = `${lw}px auto ${rw}px`
    leftSidebar.classList.toggle("sb-collapsed",  leftCollapsed)
    rightSidebar.classList.toggle("sb-collapsed", rightCollapsed)

    if (!animate) {
      requestAnimationFrame(() => {
        quartzBody.style.transition = "grid-template-columns 0.3s ease"
      })
    }

    // reposition the fixed buttons after the grid reflows
    const leftBtn  = document.getElementById("sb-toggle-left")  as HTMLElement | null
    const rightBtn = document.getElementById("sb-toggle-right") as HTMLElement | null
    if (leftBtn && rightBtn) {
      updateButtonIcons(leftBtn, rightBtn)
      positionButtons(leftBtn, rightBtn, leftSidebar, rightSidebar)
    }
  }

  // ── button icon helper ─────────────────────────────────────────────────
  const updateButtonIcons = (leftBtn: HTMLElement, rightBtn: HTMLElement) => {
    leftBtn.innerHTML  = leftCollapsed  ? "▶" : "◀"
    leftBtn.title      = leftCollapsed  ? "Expand left sidebar"  : "Collapse left sidebar"
    rightBtn.innerHTML = rightCollapsed ? "◀" : "▶"
    rightBtn.title     = rightCollapsed ? "Expand right sidebar" : "Collapse right sidebar"
  }

  // ── create or reuse fixed toggle buttons ──────────────────────────────
  const getOrCreate = (id: string) => {
    let btn = document.getElementById(id) as HTMLButtonElement | null
    if (!btn) {
      btn = document.createElement("button")
      btn.id        = id
      btn.className = "sb-toggle-btn"
      btn.setAttribute("aria-label", id === "sb-toggle-left" ? "Toggle left sidebar" : "Toggle right sidebar")
      document.body.appendChild(btn)
    }
    return btn
  }

  const leftBtn  = getOrCreate("sb-toggle-left")
  const rightBtn = getOrCreate("sb-toggle-right")

  // ── click handlers (remove old listeners first via cleanup) ───────────
  const onLeft = () => {
    leftCollapsed = !leftCollapsed
    localStorage.setItem("sb-left", leftCollapsed ? "1" : "0")
    applyLayout(true)
  }
  const onRight = () => {
    rightCollapsed = !rightCollapsed
    localStorage.setItem("sb-right", rightCollapsed ? "1" : "0")
    applyLayout(true)
  }

  leftBtn.addEventListener("click",  onLeft)
  rightBtn.addEventListener("click", onRight)

  window.addCleanup(() => {
    leftBtn.removeEventListener("click",  onLeft)
    rightBtn.removeEventListener("click", onRight)
  })

  // ── resize: hide buttons on mobile/tablet ─────────────────────────────
  const onResize = () => {
    const show = window.innerWidth >= 1200
    leftBtn.style.display  = show ? "" : "none"
    rightBtn.style.display = show ? "" : "none"
    if (show) positionButtons(leftBtn, rightBtn, leftSidebar, rightSidebar)
  }
  window.addEventListener("resize", onResize)
  window.addCleanup(() => window.removeEventListener("resize", onResize))

  // ── initial render (no animation) ─────────────────────────────────────
  applyLayout(false)
  leftBtn.style.display  = ""
  rightBtn.style.display = ""
})
