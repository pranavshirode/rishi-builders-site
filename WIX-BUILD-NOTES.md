# Wix Studio Build Notes — Rishi Builders & Developers

Reference for whoever rebuilds this proof inside the Real Estate Agency
template (wix.com/website-template/view/html/3751). Maps each custom element
in the HTML/CSS demo to the native Wix Studio component that recreates it,
so nothing gets rebuilt as a raw HTML embed unless flagged below.

## Alignment
- All page content sits inside a 1240px-max container with 32px side padding.
  Set your Wix Studio **Site Container** / section content width to match —
  including the header strip. (The demo previously had the header 80px wider
  than the page below it; that's fixed now so the logo lines up with content.)
- Breakpoints match this template's tiers exactly: Desktop 1001px+,
  Tablet 751–1000px, Mobile 320–750px. Use these three, not custom ones,
  so the proof previews the same way the live Wix site will.

## Component mapping
| Demo element | Native Wix Studio component |
|---|---|
| Sticky header w/ dropdown | Header (pin to top) + Dropdown Menu element |
| Hero image/video slider | Slideshow (Strip) — set slide 1 media type to Video, upload sample.mp4 |
| Hover-reveal project cards | Box + **Hover Box** (Regular state = chip, Hover state = reveal panel) |
| Featured/Ongoing/Upcoming/Completed project rows | **Repeater** bound to a CMS Collection, filtered by status field |
| Floor plan tabs | Tabs element, or Repeater + State Box swapping the image |
| FAQ accordion | Accordion element (built-in) |
| Gold→terracotta accent line (under eyebrows, section dividers, footer top) | A thin rectangle Shape/Line element with a gradient fill — not a CSS trick, an actual selectable object |
| Enquiry / contact / careers forms | Wix Forms element, connected to your CRM/email |
| Google Map embed placeholder | Wix Maps element with your office address |
| WhatsApp / Call floating buttons | Wix "Contact" floating buttons widget, or two Button elements pinned bottom-right |

## Things that need a Velo (code) embed, not a standard element
- None of the current design relies on custom JavaScript beyond what Wix's
  native components already provide (slideshow autoplay, hover states,
  accordion, tabs, mobile menu). Everything above can be built with
  drag-and-drop elements — no custom code panel required.

## CMS collections to set up
1. **Projects** — fields: name, type (Residential/Commercial/NA Plot/Agricultural),
   status (Ongoing/Upcoming/Completed), location, starting price, hero image,
   gallery images, RERA no., possession date, detail page link.
2. **Jobs** — fields: title, location, type, experience, apply link.
3. **Gallery** — fields: image/video, category (Project/Construction/Drone/Video).

Each project detail page (residential/commercial/land) is one Dynamic Page
template driven by the Projects collection — exactly as labelled in the
proof-bar on those pages.
