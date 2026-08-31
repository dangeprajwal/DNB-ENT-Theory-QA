import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"

type PaperInfo = { paper: string; subject: string }

// Map slug → DNB paper + subject for SEO titles
function getPaperInfo(slug: string): PaperInfo | null {
  if (slug.includes("01-Otology")) return { paper: "Paper 1", subject: "Otology" }
  if (slug.includes("02-Rhinology"))
    return { paper: "Paper 2", subject: "Rhinology & Oral Cavity" }
  if (slug.includes("03-Larynx")) return { paper: "Paper 3", subject: "Larynx & Head Neck" }
  if (slug.includes("04-General")) return { paper: "Paper 4", subject: "General Topics" }
  return null
}

// Strip boilerplate from auto-extracted description so it doesn't read
// "Questions Covered Q4 (2019) [remaining parts]..."
function cleanDescription(raw: string | undefined): string {
  if (!raw) return ""
  let s = unescapeHTML(raw.trim())
  // Remove "Questions Covered" lead-in and any "Q(num) (year)" markers
  s = s.replace(/Questions Covered\s*/gi, "")
  s = s.replace(/Q\d+\s*\(\d{4}\)\s*\[[^\]]*\]:?\s*/g, "")
  s = s.replace(/Q\d+\s*\(\d{4}\):?\s*/g, "")
  s = s.replace(/\s+/g, " ").trim()
  // Truncate at sentence boundary near 160 chars (Google's typical SERP cap)
  if (s.length > 160) {
    const cut = s.slice(0, 160)
    const lastDot = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("?"), cut.lastIndexOf("!"))
    s = lastDot > 80 ? cut.slice(0, lastDot + 1) : cut.replace(/\s+\S*$/, "") + "…"
  }
  return s
}

// SEO title — lead with clinical/topic keyword, add "Notes" (high search
// volume), keep "DNB ENT" + subject, drop "(Paper N)" and edition qualifier
// (nobody Googles those; edition qualifier is misleading during 8e→9e transition).
function buildSeoTitle(
  baseTitle: string,
  slug: string,
  pageTitleSuffix: string,
  sitePageTitle: string,
): string {
  const info = getPaperInfo(slug)
  // Homepage and top-level pages keep their own title
  if (!info || slug === "index" || slug === "About" || slug === "Disclaimer") {
    return baseTitle + pageTitleSuffix
  }
  // Normalize slug — folder pages arrive as ".../index"; strip it so regexes match
  const s = slug.replace(/\/index$/, "")
  // Top-level paper folders: Answers/01-Otology
  if (/^Answers\/0[1-4]-[^/]+$/.test(s)) {
    return `${info.subject} — DNB ENT Notes & Answers | Scott-Brown`
  }
  // Subfolder index pages: Answers/01-Otology/Audiology-and-Hearing
  if (/^Answers\/0[1-4]-[^/]+\/[^/]+$/.test(s)) {
    // Use folder name as human-friendly title (replace hyphens with spaces)
    const folderName = s.split("/").pop()!.replace(/-/g, " ")
    return `${folderName} — DNB ENT Notes | ${info.subject} | Scott-Brown`
  }
  // Individual answer page — leads with clinical topic (highest SEO weight)
  return `${baseTitle} — DNB ENT Notes & Answer | ${info.subject} | Scott-Brown`
}

// Build keyword list from frontmatter tags + paper info
function buildKeywords(fileData: any, slug: string): string {
  const tags: string[] = (fileData?.frontmatter?.tags ?? []).map((t: any) => String(t))
  const info = getPaperInfo(slug)
  const baseKeywords = ["DNB ENT", "ENT exam", "DNB theory", "Scott-Brown", "Otorhinolaryngology"]
  if (info) {
    baseKeywords.push(info.paper, info.subject, `DNB ENT ${info.paper}`)
  }
  // Title also makes good keywords
  if (fileData?.frontmatter?.title) {
    baseKeywords.push(String(fileData.frontmatter.title))
  }
  // Dedupe, keep human-readable order
  const seen = new Set<string>()
  const out: string[] = []
  for (const k of [...baseKeywords, ...tags]) {
    const cleaned = k.replace(/^paper\d+$/i, "").trim()
    if (cleaned && !seen.has(cleaned.toLowerCase())) {
      seen.add(cleaned.toLowerCase())
      out.push(cleaned)
    }
  }
  return out.join(", ")
}

// Build JSON-LD structured data for Google rich results
function buildJsonLd(args: {
  title: string
  description: string
  url: string
  iconPath: string
  isAnswer: boolean
  paperInfo: PaperInfo | null
  publishedAt?: Date | string
  modifiedAt?: Date | string
  authorName: string
}): string {
  const {
    title,
    description,
    url,
    iconPath,
    isAnswer,
    paperInfo,
    publishedAt,
    modifiedAt,
    authorName,
  } = args
  // For answer pages emit MedicalScholarlyArticle; otherwise WebSite
  if (isAnswer) {
    const data: any = {
      "@context": "https://schema.org",
      "@type": "MedicalScholarlyArticle",
      headline: title,
      description,
      url,
      author: { "@type": "Person", name: authorName },
      publisher: {
        "@type": "Organization",
        name: "DNB ENT Theory Q&A",
        logo: { "@type": "ImageObject", url: iconPath },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      educationalLevel: "Postgraduate",
      audience: { "@type": "MedicalAudience", audienceType: "Medical resident / DNB candidate" },
    }
    if (paperInfo) {
      data.about = `DNB ENT ${paperInfo.paper} — ${paperInfo.subject}`
    }
    if (publishedAt) data.datePublished = new Date(publishedAt).toISOString()
    if (modifiedAt) data.dateModified = new Date(modifiedAt).toISOString()
    return JSON.stringify(data)
  }
  // Default: a WebSite + SiteNavigation hint for the home page
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DNB ENT Theory Q&A",
    description,
    url,
  })
}

// Inline click tracking — fires gtag events for internal link clicks
// so the analytics blind spot we identified gets filled.
const CLICK_TRACKING_SCRIPT = `
(function(){
  if (typeof window === 'undefined') return;
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;
    var isExternal = /^https?:/.test(href) && !href.includes(window.location.host);
    var label = a.textContent ? a.textContent.trim().slice(0, 80) : href;
    if (typeof window.gtag === 'function') {
      window.gtag('event', isExternal ? 'click_external' : 'click_internal', {
        link_url: href,
        link_text: label,
        page_path: window.location.pathname
      });
    }
  }, { passive: true });
})();
`

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources, ctx }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const baseTitle =
      fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title

    const rawDescription =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      fileData.description?.trim() ??
      i18n(cfg.locale).propertyDefaults.description

    const cleanedDescription = cleanDescription(rawDescription)
    const description =
      cleanedDescription ||
      "DNB ENT theory exam answers based on Scott-Brown's Otorhinolaryngology 8th Edition. Comprehensive answers for all 4 papers from 2011 to 2025."

    const slug = fileData.slug ?? ""
    const paperInfo = getPaperInfo(slug)
    const isAnswer =
      !!paperInfo &&
      slug.startsWith("Answers/") &&
      !/Answers\/0[1-4]-[^/]+\/?$/.test(slug) &&
      !/Answers\/0[1-4]-[^/]+\/[^/]+\/?$/.test(slug)

    const title = buildSeoTitle(baseTitle, slug, titleSuffix, cfg.pageTitle)
    const keywords = buildKeywords(fileData, slug)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    const rawSocialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)
    // Google prefers the folder-slash URL over the /index variant.
    // Emit canonicals & OG URLs matching that preference so GSC doesn't
    // flag "/index" pages as "Alternative page with proper canonical tag".
    const socialUrl = rawSocialUrl.replace(/\/index$/, "/")

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    const jsonLd = buildJsonLd({
      title,
      description,
      url: socialUrl,
      iconPath: `https://${cfg.baseUrl}/static/icon.png`,
      isAnswer,
      paperInfo,
      publishedAt: fileData.dates?.created,
      modifiedAt: fileData.dates?.modified,
      authorName: "Dr. Prajwal Dange",
    })

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isAnswer ? "article" : "website"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
            <link rel="canonical" href={socialUrl} />
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content="Dr. Prajwal Dange, MCh Head Neck Surgery (AIIMS Raipur)" />
        <meta name="google-site-verification" content="K2TIFU3ZQyJPMjBYeU5efeNNZFVp9gri-Y7Ccn1Hd80" />
        <meta name="generator" content="Quartz" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <script dangerouslySetInnerHTML={{ __html: CLICK_TRACKING_SCRIPT }} />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
