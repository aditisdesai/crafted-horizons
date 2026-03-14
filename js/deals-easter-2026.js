/**
 * deals-easter-2026.js
 * ─────────────────────────────────────────────────────────────────────────────
 * DATA FILE for the Easter Break 2026 deals landing page.
 * This is the ONLY file you need to edit to:
 *   • Add or remove deals
 *   • Change page copy (headline, intro, story paragraphs, etc.)
 *   • Update prices or inclusions on an existing deal
 *
 * Loaded by: easter-break-2026.html
 * Consumed by: the inline <script> block at the bottom of easter-break-2026.html
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A NEW DEAL
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Copy one of the existing deal objects below.
 * 2. Paste it as a new item at the end of the EASTER_DEALS array (before the
 *    closing bracket]).
 * 3. Give it a unique `id` — use lowercase, hyphens only (e.g. "rhodes-lindos").
 *    The id is used to match card gradients and to build WhatsApp enquiry links.
 * 4. Fill in all fields (see field reference below).
 * 5. Set `status: "live"` to make it appear on the page, or `status: "draft"`
 *    to hide it without deleting it.
 * 6. Save the file. The page renders from this data automatically — no HTML edits needed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEAL FIELD REFERENCE
 * ─────────────────────────────────────────────────────────────────────────────
 * id            — unique string slug. Also used in cardGradient() map in the HTML.
 *                 To add a custom gradient for a new destination, add an entry to
 *                 the cardGradient() map in easter-break-2026.html.
 *
 * badge         — short label shown in the coloured pill (e.g. "Great value")
 * badgeStyle    — colour key: "green" | "blue" | "terra" | "amber"
 * editorsPick   — true | false. Editors picks are sorted first in "Recommended" view
 *                 and get a gold "★ Editor's pick" label in the top-right of the card.
 *
 * destination   — display name for the resort/town (e.g. "Stalis, Crete")
 * region        — area name used for context (e.g. "Heraklion Area")
 * hotelName     — full hotel/apartment name
 * starRating    — integer 1–5. Use 0 to omit stars.
 * roomType      — short room description (shown in card chips area)
 * boardBasis    — e.g. "All Inclusive", "Self Catering", "Half Board", "Bed & Breakfast"
 *
 * nights        — integer number of nights
 * travelDate    — departure date string (e.g. "3 Apr 2026")
 * returnDate    — return date string (e.g. "7 Apr 2026")
 * flightSummary — route string (e.g. "London Stansted (STN) → Heraklion (HER)")
 *
 * totalPrice    — integer total price for the party in GBP (or set currency below)
 * pricePerPerson — integer price per person
 * wasPrice      — integer original/crossed-out price, or null if no saving to show
 * currency      — currently "GBP" (displayed as £). Extend fmt() in HTML if needed.
 *
 * includes      — array of strings. Each item gets a ✓ tick in the card.
 *                 Keep to 3–5 items. Focus on what's worth calling out (free child
 *                 place, transfers, baggage, board basis if notable).
 *
 * highlights    — array of strings. Each item gets an em-dash bullet.
 *                 Use for hotel/resort selling points. 3–5 items works well.
 *
 * whyIPicked    — Aditi's personal note about the deal. 2–3 sentences. Italic, shown
 *                 at the bottom of the card with a speech bubble icon.
 *                 Set to null or "" to hide this section on the card.
 *
 * familyFriendly   — true | false (reserved for future filter use)
 * flightsIncluded  — true | false. Shows "✈ Flights" chip on card when true.
 * departureAirport — full airport name shown on card (e.g. "London Stansted")
 *
 * category      — array of filter strings. Must contain values matching the filter
 *                 chips in the HTML: "beach", "all-inclusive", "self-catering",
 *                 "half-board". You can add "family", "city", etc. and create
 *                 matching filter chips in the HTML filter bar.
 *                 Cards only appear in a filter if their category array contains
 *                 that filter's value.
 *
 * ctaLabel      — text on the card's CTA button (e.g. "Ask about this deal")
 * status        — "live" to show on page | "draft" to hide without deleting
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO CHANGE PAGE COPY
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit the CAMPAIGN object below. Every field is used in the HTML's DOMContentLoaded
 * block to populate the page. Fields are clearly named — see inline comments.
 *
 * To run a completely different campaign (e.g. Summer 2026), you could:
 *   1. Duplicate this file as e.g. deals-summer-2026.js
 *   2. Create a new HTML page loading that file
 *   3. Update CAMPAIGN and EASTER_DEALS (rename the const for clarity)
 * ─────────────────────────────────────────────────────────────────────────────
 */


/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGN — all editable page copy lives here
   ═══════════════════════════════════════════════════════════════════════════ */

const CAMPAIGN = {

  /* ── SEO / meta ──────────────────────────────────────────────────────────
     Keep pageTitle under 60 characters for Google.
     metaDescription: 120–155 characters is ideal.
     canonicalUrl: full URL including https://
     ogImage: absolute URL to a 1200×630px image (used for social sharing cards)
  ──────────────────────────────────────────────────────────────────────── */
  pageTitle:        "Easter Break 2026 Family Deals — Crafted Horizons",
  metaDescription:  "Hand-picked Easter 2026 family holiday deals — Crete, Turkey, Lanzarote and Tenerife. Personally researched by Aditi at Crafted Horizons. Enquire for tailored options.",
  canonicalUrl:     "https://crafted-horizons.com/easter-break-2026",
  ogImage:          "https://crafted-horizons.com/assets/brand/crafted-horizons-og-easter-2026.jpg",

  /* ── Hero chip / campaign label ─────────────────────────────────────────
     Appears in the small pill at the top of the hero section.
     Keep it short — it's a label, not a headline.
  ──────────────────────────────────────────────────────────────────────── */
  campaignLabel:    "Easter Break 2026 · Live Deals",

  /* ── Hero text ───────────────────────────────────────────────────────── */
  heroHeadline:     "Easter family deals — personally picked for you",
  heroSub:          "Four destinations I've actually researched, with prices checked against live supplier systems. No algorithms. Just an advisor who's done the legwork.",
  heroIntro:        "Every deal on this page has been pulled from professional booking platforms and checked manually. If something catches your eye, drop me a message and I'll check live availability and get you a tailored quote.",

  /* ── Hero CTAs ───────────────────────────────────────────────────────── */
  heroCta1Label:    "See the deals",
  heroCta1Href:     "#deals",
  heroCta2Label:    "Talk to Aditi",
  heroCta2Href:     "#enquire",

  /* ── Story section ───────────────────────────────────────────────────── */
  storyEyebrow:     "From Aditi's desk",
  storyTitle:       "Why I put this page together",
  storyParas: [
    "Easter is one of the busiest booking windows of the year, and it's also one of the most confusing. Prices move fast, comparison sites show packages that don't reflect what's actually available, and it can take hours to work out whether you're actually getting a good deal.",
    "So I did the searching for you. These four deals are ones I found on my professional booking platform this week — real pricing, real availability. They're not sponsored listings or affiliate links. They're just the ones that caught my eye as good value for families heading away over Easter.",
    "If any of them look right for your family — or if you want something different — get in touch. I can check current pricing, swap airports, adjust dates, and build something around your budget. That's what I'm here for.",
  ],

  /* ── Trust strip — 4 points ──────────────────────────────────────────── */
  trustPoints: [
    {
      icon:    "🔍",
      heading: "Researched by a real advisor",
      body:    "Prices checked manually against live supplier systems — not generated by a comparison engine or aggregator.",
    },
    {
      icon:    "⏱",
      heading: "Live at time of research",
      body:    "Holiday prices change daily. These were accurate when I checked. Enquire for the latest pricing before booking.",
    },
    {
      icon:    "👨‍👩‍👧‍👦",
      heading: "Family-focused curation",
      body:    "I've filtered for the things families care about: direct flights, sensible board basis, child-friendly hotels, and manageable transfer times.",
    },
    {
      icon:    "✏️",
      heading: "Tailored options available",
      body:    "None of these quite right? I can search your airport, your dates, your budget — and come back with options matched to your family.",
    },
  ],

  /* ── Why book with an advisor — 4 points ────────────────────────────── */
  whyPoints: [
    {
      heading: "Not a search engine — an advisor",
      body:    "Every deal has been looked at by a human. I filter out the hotels with poor reviews, the awkward connections, and the hidden charges — so you don't have to.",
    },
    {
      heading: "Saves you hours",
      body:    "I've already done the comparing, cross-referencing, and sense-checking. You get a shortlist worth looking at, not a wall of options.",
    },
    {
      heading: "One-to-one support",
      body:    "You deal directly with me — no call centres, no queues, no being passed around. WhatsApp or email works for me.",
    },
    {
      heading: "Trade platform access",
      body:    "I book through professional platforms used by travel agents. That sometimes means better availability, better pricing, or extras that aren't visible to the public.",
    },
  ],

  /* ── Mid-page CTA banner ─────────────────────────────────────────────── */
  midCtaHeadline:  "Not seeing exactly what you need?",
  midCtaBody:      "Tell me your airport, dates and rough budget — I'll put together options specifically for your family.",
  midCtaLabel:     "Get personalised options →",

  /* ── Bottom enquiry section ──────────────────────────────────────────── */
  bottomCtaHeadline: "Ready to enquire? Let's talk.",
  bottomCtaBody:     "Drop me a message with your dates, airport and family size and I'll come back to you with availability and a tailored quote. No commitment — just a conversation.",

  /* ── Enquiry form default message ────────────────────────────────────── */
  // Pre-fills the WhatsApp/form message when no specific deal is selected.
  // Keep conversational — this is what the client will send to Aditi.
  enquiryDefaultMessage: "Hi Aditi, I've seen your Easter 2026 deals page and I'd love some personalised options for my family. Can you help?",

};


/* ═══════════════════════════════════════════════════════════════════════════
   EASTER_DEALS — one object per deal
   ═══════════════════════════════════════════════════════════════════════════
   See field reference at the top of this file.
   To hide a deal without deleting it, change status to "draft".
   To reorder deals in "Recommended" sort, set editorsPick: true on the ones
   you want at the top (they sort above non-editor picks).
   ═══════════════════════════════════════════════════════════════════════════ */

const EASTER_DEALS = [

  /* ── Deal 1: Crete ─────────────────────────────────────────────────── */
  {
    id:            "crete-maria-lambis",

    badge:         "Great value",
    badgeStyle:    "green",       // "green" | "blue" | "terra" | "amber"
    editorsPick:   false,

    destination:   "Stalis, Crete",
    region:        "Heraklion Area",
    hotelName:     "Maria Lambis Apartments",
    starRating:    3,
    roomType:      "Apartment — sleeps up to 4",
    boardBasis:    "Self Catering",

    nights:        4,
    travelDate:    "3 Apr 2026",
    returnDate:    "7 Apr 2026",
    flightSummary: "London Stansted (STN) → Heraklion (HER)",

    totalPrice:    1557,
    pricePerPerson: 517,
    wasPrice:      null,          // null = no crossed-out price shown
    currency:      "GBP",

    // ✓ tick list — keep to 3–5 items
    includes: [
      "1 × Free Child Place",
      "Coach Transfers",
      "4 × 10kg Hand Baggage",
      "4 × 22kg Bag Allowance",
    ],

    // em-dash bullet list — hotel/resort selling points
    highlights: [
      "Traditional charm & pretty gardens",
      "Quiet, relaxing location in Stalis",
      "Walking distance to local tavernas",
      "Free Wi-Fi throughout",
    ],

    // Aditi's personal note — 2–3 sentences, shown italic at the bottom of the card
    whyIPicked: "A genuinely good-value short break for families who want simplicity and warmth. Stalis is one of the more relaxed resorts on Crete — great if you want to explore local tavernas rather than a big resort complex.",

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "London Stansted",

    // Must match filter chip data-filter values in the HTML
    category: ["family", "beach", "self-catering"],

    ctaLabel: "Ask about this deal",
    status:   "live",   // "live" | "draft"
  },

  /* ── Deal 2: Turkey ────────────────────────────────────────────────── */
  {
    id:            "side-turkey-kumkoy",

    badge:         "Popular with families",
    badgeStyle:    "blue",
    editorsPick:   true,

    destination:   "Side, Turkey",
    region:        "Antalya Coast",
    hotelName:     "Kumköy Beach Resort & Spa",
    starRating:    5,
    roomType:      "Standard Room — Family of 4",
    boardBasis:    "All Inclusive",

    nights:        7,
    travelDate:    "5 Apr 2026",
    returnDate:    "12 Apr 2026",
    flightSummary: "London Gatwick (LGW) → Antalya (AYT)",

    totalPrice:    3299,
    pricePerPerson: 825,
    wasPrice:      3599,          // shows "Save £300" on the card
    currency:      "GBP",

    includes: [
      "All Inclusive board",
      "Return flights from Gatwick",
      "20kg Baggage per person",
      "Resort transfers included",
    ],

    highlights: [
      "Beachfront with private beach",
      "Multiple pools incl. kids' splash zone",
      "Evening entertainment for all ages",
      "All meals & drinks — no hidden costs",
    ],

    whyIPicked: "Side in April is reliably warm and quieter than peak summer. This is the kind of hotel where kids are well looked after and parents can actually relax. All inclusive takes all the stress out of budgeting on holiday.",

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "London Gatwick",

    category: ["family", "beach", "all-inclusive"],

    ctaLabel: "I want this deal",
    status:   "live",
  },

  /* ── Deal 3: Lanzarote ─────────────────────────────────────────────── */
  {
    id:            "lanzarote-costa-teguise",

    badge:         "Warm-weather pick",
    badgeStyle:    "terra",
    editorsPick:   false,

    destination:   "Costa Teguise, Lanzarote",
    region:        "Canary Islands",
    hotelName:     "Las Cucharas Apartments",
    starRating:    3,
    roomType:      "Apartment — sleeps up to 4",
    boardBasis:    "Self Catering",

    nights:        7,
    travelDate:    "4 Apr 2026",
    returnDate:    "11 Apr 2026",
    flightSummary: "London Gatwick (LGW) → Lanzarote (ACE)",

    totalPrice:    2199,
    pricePerPerson: 550,
    wasPrice:      null,
    currency:      "GBP",

    includes: [
      "Return flights from Gatwick",
      "Self catering apartment",
      "20kg Baggage per person",
      "Arrival transfers",
    ],

    highlights: [
      "Costa Teguise — quieter resort, great for families",
      "Minutes from Las Cucharas beach",
      "Pool complex with sun terraces",
      "Good local restaurants & supermarkets nearby",
    ],

    whyIPicked: "Lanzarote in April is reliably warm — just a 4-hour flight. Costa Teguise is my preferred pick over Puerto del Carmen: more laid-back, less touristy, and the beach is genuinely lovely.",

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "London Gatwick",

    category: ["family", "beach", "self-catering"],

    ctaLabel: "Check availability",
    status:   "live",
  },

  /* ── Deal 4: Tenerife ──────────────────────────────────────────────── */
  {
    id:            "tenerife-cleopatra",

    badge:         "Editor's pick",
    badgeStyle:    "green",
    editorsPick:   true,

    destination:   "Playa de las Américas, Tenerife",
    region:        "Canary Islands",
    hotelName:     "Hotel Cleopatra Palace",
    starRating:    4,
    roomType:      "Standard Room — sleeps up to 4",
    boardBasis:    "Half Board",

    nights:        7,
    travelDate:    "2 Apr 2026",
    returnDate:    "9 Apr 2026",
    flightSummary: "London Heathrow (LHR) → Tenerife South (TFS)",

    totalPrice:    2849,
    pricePerPerson: 712,
    wasPrice:      3100,          // shows "Save £251" on the card
    currency:      "GBP",

    includes: [
      "Return flights from Heathrow",
      "Half board (breakfast & dinner)",
      "20kg Baggage per person",
      "Airport transfers",
    ],

    highlights: [
      "Heated outdoor pool — great in April",
      "Evening entertainment for all ages",
      "Walk to waterfront & restaurants",
      "Half board — meals sorted, no commitment",
    ],

    whyIPicked: "Tenerife is the most consistent warm-weather pick from the UK in April — you're almost guaranteed sunshine. This hotel has a strong family reputation and half board means you get dinner sorted without committing fully to all-inclusive.",

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "London Heathrow",

    category: ["family", "beach", "half-board"],

    ctaLabel: "Ask about this deal",
    status:   "live",
  },

  /*
   * ── TEMPLATE — copy this block to add a new deal ─────────────────────
   *
   * {
   *   id:            "destination-hotel-slug",  // unique, lowercase, hyphens only
   *
   *   badge:         "Your badge text",
   *   badgeStyle:    "green",                   // green | blue | terra | amber
   *   editorsPick:   false,
   *
   *   destination:   "Resort, Country",
   *   region:        "Area Name",
   *   hotelName:     "Full Hotel Name",
   *   starRating:    4,                         // 1–5, or 0 to omit
   *   roomType:      "Room description",
   *   boardBasis:    "All Inclusive",
   *
   *   nights:        7,
   *   travelDate:    "18 Jul 2026",
   *   returnDate:    "25 Jul 2026",
   *   flightSummary: "London Gatwick (LGW) → Destination (XXX)",
   *
   *   totalPrice:    2500,
   *   pricePerPerson: 625,
   *   wasPrice:      null,                      // or integer if showing saving
   *   currency:      "GBP",
   *
   *   includes: [
   *     "Return flights",
   *     "20kg Baggage per person",
   *     "Resort transfers",
   *   ],
   *
   *   highlights: [
   *     "Highlight one",
   *     "Highlight two",
   *     "Highlight three",
   *   ],
   *
   *   whyIPicked: "Your personal note about why this deal is worth considering.",
   *
   *   familyFriendly:   true,
   *   flightsIncluded:  true,
   *   departureAirport: "London Gatwick",
   *
   *   category: ["family", "beach", "all-inclusive"],
   *
   *   ctaLabel: "Ask about this deal",
   *   status:   "draft",   // change to "live" when ready to publish
   * },
   *
   * ─────────────────────────────────────────────────────────────────────
   * Don't forget to add a cardGradient entry in easter-break-2026.html
   * if you want a custom colour for the card header:
   *
   *   const map = {
   *     ...existing entries...
   *     'yourkeyword': 'linear-gradient(135deg, #xxxxxx 0%, #yyyyyy 100%)',
   *   };
   *
   * The map key just needs to appear somewhere in the deal id string.
   * ─────────────────────────────────────────────────────────────────────
   */

];
