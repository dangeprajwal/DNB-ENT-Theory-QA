import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Shutdown message shown at every unmatched URL.
// To restore normal behavior, revert this file.
const NotFound: QuartzComponent = () => {
  return (
    <article class="popover-hint">
      <h1>This resource is no longer available.</h1>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
