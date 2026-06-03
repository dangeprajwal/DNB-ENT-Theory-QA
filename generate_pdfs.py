#!/usr/bin/env python3
"""
Generate print-ready PDFs from markdown notes.
Format: Times New Roman 12pt, Justified, 1.5 line spacing, bold headings.
"""

import re
import os
from weasyprint import HTML, CSS
from pathlib import Path

# ---- Paths ----------------------------------------------------------------
NOTES = [
    (
        "content/Answers/01 Otology/Audiology and Hearing/Congenital Hearing Loss.md",
        "Congenital Hearing Loss.pdf",
    ),
    (
        "content/Answers/01 Otology/Middle Ear and Mastoid/Otosclerosis.md",
        "Otosclerosis.pdf",
    ),
    (
        "content/Answers/01 Otology/Facial Nerve and Skull Base/SCDS and Temporal Bone.md",
        "SCDS and Temporal Bone.pdf",
    ),
]

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = Path("/Users/prajwaldange/Downloads/DNB Theory Q&A/PDFs for Printing")

# ---- CSS ------------------------------------------------------------------
PDF_CSS = CSS(string="""
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');

@page {
    size: A4;
    margin: 2.5cm 2.5cm 2.5cm 2.5cm;
    @bottom-center {
        content: counter(page);
        font-family: 'Times New Roman', Times, serif;
        font-size: 10pt;
    }
}

body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    color: #000000;
    orphans: 3;
    widows: 3;
}

h1 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    margin-top: 24pt;
    margin-bottom: 12pt;
    page-break-after: avoid;
    color: #000000;
}

h2 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 8pt;
    page-break-after: avoid;
    color: #000000;
    border-bottom: 1pt solid #000000;
    padding-bottom: 2pt;
}

h3 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    margin-top: 14pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
    color: #000000;
}

h4 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin-top: 10pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
    color: #000000;
}

h5, h6 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    margin-top: 8pt;
    margin-bottom: 4pt;
    color: #000000;
}

p {
    margin: 6pt 0;
    text-align: justify;
    text-indent: 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0 10pt 0;
    font-size: 11pt;
    page-break-inside: avoid;
}

th {
    background-color: #f0f0f0;
    border: 1pt solid #333333;
    padding: 5pt 7pt;
    font-weight: bold;
    text-align: left;
    font-family: 'Times New Roman', Times, serif;
}

td {
    border: 1pt solid #666666;
    padding: 4pt 7pt;
    text-align: left;
    font-family: 'Times New Roman', Times, serif;
    vertical-align: top;
}

tr:nth-child(even) td {
    background-color: #f9f9f9;
}

/* Lists */
ul, ol {
    margin: 6pt 0 6pt 0;
    padding-left: 24pt;
}

li {
    margin-bottom: 3pt;
    text-align: justify;
}

/* Block quotes (callout boxes) */
blockquote {
    border-left: 3pt solid #333333;
    margin: 10pt 0 10pt 20pt;
    padding: 6pt 12pt;
    background-color: #f5f5f5;
    font-style: italic;
}

blockquote p {
    margin: 4pt 0;
}

/* Strong / bold */
strong, b {
    font-weight: bold;
}

/* Horizontal rule */
hr {
    border: none;
    border-top: 1pt solid #999999;
    margin: 14pt 0;
}

/* Code inline */
code {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
}

/* Key points box */
.key-points {
    border: 1.5pt solid #000000;
    padding: 10pt;
    margin: 10pt 0;
    background-color: #f5f5f5;
}

/* Page break helpers */
.page-break {
    page-break-before: always;
}
""")

# ---- Markdown to HTML conversion ------------------------------------------

def md_to_html(md_text: str, title: str) -> str:
    """Convert markdown to clean HTML for WeasyPrint."""

    # Remove YAML front matter
    md_text = re.sub(r'^---\n.*?\n---\n', '', md_text, flags=re.DOTALL)

    # Remove Obsidian [[wikilinks]] — keep display text
    md_text = re.sub(r'\[\[([^\]|]+)\|([^\]]+)\]\]', r'\2', md_text)
    md_text = re.sub(r'\[\[([^\]]+)\]\]', r'\1', md_text)

    # Remove Obsidian callout syntax: > [!question], > [!abstract], > [!tip]
    md_text = re.sub(r'>\s*\[!(question|abstract|tip|note|info|warning)\]\s*', '> **Note:** ', md_text)

    lines = md_text.split('\n')
    html_lines = []
    in_table = False
    in_blockquote = False
    in_ul = False
    in_ol = False
    table_rows = []
    list_items = []
    ol_counter = [0]

    def flush_list():
        nonlocal in_ul, in_ol
        if in_ul and list_items:
            html_lines.append('<ul>')
            for item in list_items:
                html_lines.append(f'<li>{item}</li>')
            html_lines.append('</ul>')
            list_items.clear()
            in_ul = False
        elif in_ol and list_items:
            html_lines.append('<ol>')
            for item in list_items:
                html_lines.append(f'<li>{item}</li>')
            html_lines.append('</ol>')
            list_items.clear()
            in_ol = False

    def flush_table():
        nonlocal in_table, table_rows
        if in_table and table_rows:
            html_lines.append('<table>')
            for i, row in enumerate(table_rows):
                cols = [c.strip() for c in row.strip('|').split('|')]
                if i == 0:
                    html_lines.append('<thead><tr>')
                    for col in cols:
                        col = apply_inline(col)
                        html_lines.append(f'<th>{col}</th>')
                    html_lines.append('</tr></thead><tbody>')
                elif i == 1 and all(re.match(r'^[-:]+$', c.strip()) for c in cols):
                    continue  # separator row
                else:
                    html_lines.append('<tr>')
                    for col in cols:
                        col = apply_inline(col)
                        html_lines.append(f'<td>{col}</td>')
                    html_lines.append('</tr>')
            html_lines.append('</tbody></table>')
            table_rows.clear()
            in_table = False

    def apply_inline(text: str) -> str:
        """Apply inline markdown formatting."""
        # Bold-italic
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', text)
        # Bold
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        # Italic
        text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
        text = re.sub(r'_(.+?)_', r'<em>\1</em>', text)
        # Inline code
        text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)
        # Markdown links [text](url) — strip URLs
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
        return text

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Table detection
        if '|' in stripped and stripped.startswith('|'):
            flush_list()
            if in_blockquote:
                html_lines.append('</blockquote>')
                in_blockquote = False
            in_table = True
            table_rows.append(stripped)
            i += 1
            continue

        if in_table and not ('|' in stripped and stripped.startswith('|')):
            flush_table()

        # Blank line
        if stripped == '':
            flush_list()
            if in_blockquote:
                # Check if next non-empty line is also a blockquote
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    j += 1
                if j < len(lines) and lines[j].strip().startswith('>'):
                    i += 1
                    continue
                else:
                    html_lines.append('</blockquote>')
                    in_blockquote = False
            i += 1
            continue

        # Horizontal rule
        if re.match(r'^(-{3,}|_{3,}|\*{3,})$', stripped):
            flush_list()
            html_lines.append('<hr/>')
            i += 1
            continue

        # Headings
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', stripped)
        if heading_match:
            flush_list()
            if in_blockquote:
                html_lines.append('</blockquote>')
                in_blockquote = False
            level = len(heading_match.group(1))
            text = apply_inline(heading_match.group(2))
            html_lines.append(f'<h{level}>{text}</h{level}>')
            i += 1
            continue

        # Blockquote
        if stripped.startswith('>'):
            flush_list()
            content = re.sub(r'^>\s*', '', stripped)
            content = apply_inline(content)
            if not in_blockquote:
                html_lines.append('<blockquote>')
                in_blockquote = True
            html_lines.append(f'<p>{content}</p>')
            i += 1
            continue

        # Unordered list
        ul_match = re.match(r'^[-*+]\s+(.+)$', stripped)
        if ul_match:
            if in_ol:
                flush_list()
            in_ul = True
            if in_blockquote:
                html_lines.append('</blockquote>')
                in_blockquote = False
            list_items.append(apply_inline(ul_match.group(1)))
            i += 1
            continue

        # Ordered list
        ol_match = re.match(r'^\d+\.\s+(.+)$', stripped)
        if ol_match:
            if in_ul:
                flush_list()
            in_ol = True
            if in_blockquote:
                html_lines.append('</blockquote>')
                in_blockquote = False
            list_items.append(apply_inline(ol_match.group(1)))
            i += 1
            continue

        # Regular paragraph
        flush_list()
        if in_blockquote:
            html_lines.append('</blockquote>')
            in_blockquote = False
        text = apply_inline(stripped)
        html_lines.append(f'<p>{text}</p>')
        i += 1

    # Flush any remaining open structures
    flush_list()
    flush_table()
    if in_blockquote:
        html_lines.append('</blockquote>')

    body = '\n'.join(html_lines)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>{title}</title>
</head>
<body>
{body}
</body>
</html>"""
    return html


# ---- Main -----------------------------------------------------------------

def generate_pdf(md_path_rel: str, out_filename: str):
    md_path = BASE_DIR / md_path_rel
    out_path = OUTPUT_DIR / out_filename

    print(f"Reading: {md_path}")
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    title = out_filename.replace('.pdf', '')
    html = md_to_html(md_text, title)

    # Optionally save HTML for inspection
    html_debug = OUTPUT_DIR / out_filename.replace('.pdf', '.html')
    with open(html_debug, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Generating PDF: {out_path}")
    HTML(string=html, base_url=str(BASE_DIR)).write_pdf(
        str(out_path),
        stylesheets=[PDF_CSS],
        presentational_hints=True,
    )
    print(f"  Done -> {out_path}")


if __name__ == '__main__':
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for md_rel, pdf_name in NOTES:
        generate_pdf(md_rel, pdf_name)
    print("\nAll PDFs generated successfully.")
