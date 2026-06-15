import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

// Renders Previous / Next links between siblings in the same folder.
// Only shown on individual answer pages (slugs under "Answers/<paper>/<topic>/<name>").
const PrevNext: QuartzComponent = ({
  fileData,
  allFiles,
  displayClass,
}: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  // Only on individual answer pages — skip folder index pages
  const parts = slug.split("/")
  if (parts.length < 4) return null
  if (!slug.startsWith("Answers/")) return null

  const folderSlug = parts.slice(0, -1).join("/")

  const siblings = allFiles
    .filter((f) => {
      const s = f.slug ?? ""
      if (!s.startsWith(folderSlug + "/")) return false
      const rest = s.slice(folderSlug.length + 1)
      // Direct children only — no nested subfolders
      if (rest.includes("/")) return false
      // Skip folder indexes
      if (rest === "" || rest === "index") return false
      return true
    })
    .sort((a, b) => {
      const at = a.frontmatter?.title ?? a.slug ?? ""
      const bt = b.frontmatter?.title ?? b.slug ?? ""
      return at.localeCompare(bt)
    })

  if (siblings.length < 2) return null

  const idx = siblings.findIndex((f) => f.slug === slug)
  if (idx < 0) return null

  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null
  if (!prev && !next) return null

  return (
    <nav class={classNames(displayClass, "prevnext")} aria-label="Answer navigation">
      <div class="prevnext-grid">
        {prev ? (
          <a class="prevnext-card prevnext-prev internal" href={resolveRelative(slug, prev.slug!)}>
            <span class="prevnext-label">← Previous</span>
            <span class="prevnext-title">{prev.frontmatter?.title}</span>
          </a>
        ) : (
          <span class="prevnext-empty" aria-hidden="true"></span>
        )}
        {next ? (
          <a class="prevnext-card prevnext-next internal" href={resolveRelative(slug, next.slug!)}>
            <span class="prevnext-label">Next →</span>
            <span class="prevnext-title">{next.frontmatter?.title}</span>
          </a>
        ) : (
          <span class="prevnext-empty" aria-hidden="true"></span>
        )}
      </div>
      <div class="prevnext-meta">
        {idx + 1} of {siblings.length} in this folder
      </div>
    </nav>
  )
}

PrevNext.css = `
.prevnext {
  margin: 3rem 0 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}
.prevnext-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.prevnext-card {
  display: flex !important;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--lightgray) !important;
  border-radius: 10px !important;
  background: var(--light);
  text-decoration: none !important;
  border-bottom: 1px solid var(--lightgray) !important;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  min-height: 64px;
}
.prevnext-card:hover {
  border-color: var(--secondary) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.prevnext-card.prevnext-next {
  text-align: right;
  align-items: flex-end;
}
.prevnext-label {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gray);
}
.prevnext-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--secondary) !important;
  line-height: 1.3;
}
.prevnext-empty { display: block; }
.prevnext-meta {
  margin-top: 0.6rem;
  text-align: center;
  font-size: 0.78rem;
  color: var(--gray);
}
@media (max-width: 600px) {
  .prevnext-grid { grid-template-columns: 1fr; }
  .prevnext-card.prevnext-next { text-align: left; align-items: flex-start; }
}
`

export default (() => PrevNext) satisfies QuartzComponentConstructor
