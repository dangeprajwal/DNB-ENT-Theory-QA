import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "DNB ENT Theory Q&A",
    pageTitleSuffix: " | Scott-Brown Answers",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "google",
      tagId: "G-KRHLW7ZCDZ",
    },
    locale: "en-US",
    baseUrl: "dangeprajwal.github.io/DNB-ENT-Theory-QA",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Fraunces",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        // Light — warm paper editorial (Steep-inspired), amber accent
        lightMode: {
          light: "#faf9f5",       // warm paper canvas
          lightgray: "#ece8de",   // warm-tinted card surface
          gray: "#8f8778",        // warm mid-gray
          darkgray: "#3f3730",    // warm dark gray for body text
          dark: "#1a1613",        // near-black warm — headings
          secondary: "#c2410c",   // terracotta — links, accent
          tertiary: "#f59e0b",    // amber — hover, active nav
          highlight: "rgba(245, 158, 11, 0.10)",
          textHighlight: "#f59e0b40",
        },
        // Dark — kept as fallback for users who explicitly prefer dark
        darkMode: {
          light: "#0f1a20",
          lightgray: "#1e2d36",
          gray: "#7a8a94",
          darkgray: "#d0dce3",
          dark: "#e8f0f5",
          secondary: "#f59e0b",   // amber accent in dark mode
          tertiary: "#fbbf24",    // amber-yellow hover
          highlight: "rgba(245, 158, 11, 0.15)",
          textHighlight: "#f59e0b55",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
