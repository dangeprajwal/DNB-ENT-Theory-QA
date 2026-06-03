import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore: inline script bundled by Quartz
import sidebarToggleScript from "./scripts/sidebar-toggle.inline"

/**
 * Invisible component whose sole purpose is to inject the
 * collapsible-sidebar JavaScript on every page.
 */
const SidebarToggle: QuartzComponent = () => <></>

SidebarToggle.afterDOMLoaded = sidebarToggleScript

export default (() => SidebarToggle) satisfies QuartzComponentConstructor
