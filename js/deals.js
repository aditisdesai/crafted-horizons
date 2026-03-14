/**
 * deals.js — MASTER CONTENT FILE for deals.html
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the ONLY file Aditi needs to edit to:
 *   • Add or remove deals
 *   • Add, hide, or update campaign tabs
 *   • Change hero copy, story copy, or enquiry messages
 *   • Update prices, inclusions, or highlights on any deal
 *
 * Loaded by: deals.html (must be loaded BEFORE the inline page script)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A NEW DEAL — step by step
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Scroll to the end of the `deals` array (just before the closing `]`).
 * 2. Copy the blank DEAL TEMPLATE block from the very bottom of this file.
 * 3. Paste it as a new item in the deals array — make sure to add a comma
 *    after the closing `}` of the previous deal before your pasted block.
 * 4. Give it a unique `id` — lowercase, hyphens only (e.g. "rhodes-lindos").
 *    The id is used to match card gradient colours and build WhatsApp links.
 *    If you want a custom card gradient, add a matching key to the
 *    cardGradient() map in deals.html (key just needs to appear in the id).
 * 5. Set `campaign` to the id of the campaign tab this deal belongs to
 *    (e.g. "easter-2026"). The campaign must exist in the campaigns array below.
 * 6. Set `travelDateRaw` to the departure date in "YYYY-MM-DD" format — this
 *    drives auto-expiry (see note below).
 * 7. Fill in all other fields (see FIELD REFERENCE further down).
 * 8. Set `status: "live"` to show the deal on the page, or keep `status: "draft"`
 *    to save it without publishing.
 * 9. Save the file. deals.html reads everything dynamically — no HTML edits needed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A NEW CAMPAIGN TAB — step by step
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Scroll to the `campaigns` array below.
 * 2. Copy the blank CAMPAIGN TEMPLATE block from the very bottom of this file.
 * 3. Paste it as a new item in the campaigns array (add a comma after the
 *    previous campaign's closing `}`).
 * 4. Give it a unique `id` (e.g. "summer-2026"). This must match the `campaign`
 *    field on any deals that belong to this tab.
 * 5. Set `active: true` to show the tab, or `active: false` to hide it.
 * 6. Fill in the hero and story copy fields.
 * 7. Add deals to the `deals` array with `campaign` matching your new id.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT travelDateRaw DOES (auto-expiry)
 * ─────────────────────────────────────────────────────────────────────────────
 * `travelDateRaw` is the departure date in "YYYY-MM-DD" format (e.g. "2026-04-03").
 *
 * deals.html compares this against today's date at page load:
 *   • If the travel date is in the future  → deal shows normally.
 *   • If the travel date is today or past  → deal is hidden from the grid.
 *
 * When ALL live deals in a campaign have expired, the grid shows a friendly
 * "These deals have now passed" message with a link to the enquiry section.
 *
 * You never need to manually remove expired deals — just leave them as "live"
 * and they will stop showing automatically. If you want to keep a deal visible
 * regardless of date (unusual), set travelDateRaw: null.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO HIDE A DEAL WITHOUT DELETING IT
 * ─────────────────────────────────────────────────────────────────────────────
 * Change the deal's `status` field from "live" to "draft":
 *
 *   status: "draft",   ← deal is saved but invisible on the page
 *
 * Change it back to "live" at any time to republish. Draft deals are completely
 * ignored by the page — they don't appear in counts or filters.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEAL FIELD REFERENCE
 * ─────────────────────────────────────────────────────────────────────────────
 * id              — unique string slug. Lowercase, hyphens only. Also used in
 *                   cardGradient() map in deals.html to pick the card header colour.
 * campaign        — must match the `id` of a campaign in the campaigns array.
 * travelDateRaw   — "YYYY-MM-DD" departure date. Used for auto-expiry. Set null to disable.
 * status          — "live" (visible) | "draft" (hidden, not deleted)
 *
 * badge           — short label in the coloured pill (e.g. "Great value")
 * badgeStyle      — colour key: "green" | "blue" | "terra" | "amber"
 * editorsPick     — true | false. Editor's picks sort first in Recommended view
 *                   and get a gold "★ Editor's pick" label on the card.
 *
 * destination     — resort/town display name (e.g. "Stalis, Crete")
 * region          — area context (e.g. "Heraklion Area")
 * hotelName       — full hotel/apartment name as it should appear on the card
 * starRating      — integer 1–5. Use 0 to omit stars display.
 * roomType        — short room description shown in the chips row
 * boardBasis      — e.g. "All Inclusive", "Self Catering", "Half Board"
 *
 * nights          — integer number of nights
 * travelDate      — human-readable departure date (e.g. "3 Apr 2026")
 * returnDate      — human-readable return date (e.g. "7 Apr 2026")
 * flightSummary   — route string shown on card (e.g. "London Stansted (STN) → Heraklion (HER)")
 *
 * totalPrice      — integer total price for the party in GBP
 * pricePerPerson  — integer price per person
 * wasPrice        — integer original price, or null if no saving to show
 * currency        — "GBP" (displayed as £). Extend fmt() in deals.html to support others.
 *
 * includes        — string array. Each item gets a ✓ tick on the card.
 *                   Keep to 3–5 items. Focus on things worth calling out:
 *                   free child place, transfers, baggage, board basis if notable.
 *
 * highlights      — string array. Each item gets an em-dash bullet.
 *                   Hotel/resort selling points. 3–5 items works well.
 *
 * whyIPicked      — Aditi's personal note. 2–3 sentences. Shown italic at card bottom.
 *                   Set to null or "" to hide this section entirely.
 *
 * familyFriendly  — true | false (reserved for future filter use)
 * flightsIncluded — true | false. Shows "✈ Flights incl." chip on card when true.
 * departureAirport— full airport name shown on card (e.g. "London Stansted")
 *
 * category        — string array. Values must match filter chip data-filter values:
 *                   "beach", "all-inclusive", "self-catering", "half-board", "family"
 *                   A deal only appears under a filter if its category array contains
 *                   that value. To add a new filter, add the value here AND add a
 *                   matching chip in deals.html's filter bar.
 *
 * ctaLabel        — text on the card's CTA button (e.g. "Ask about this deal")
 * ─────────────────────────────────────────────────────────────────────────────
 */


const DEALS_CONFIG = {

  /* ═══════════════════════════════════════════════════════════════════════════
     CAMPAIGNS
     ═══════════════════════════════════════════════════════════════════════════
     Each campaign creates a tab in the tab bar.
     Set active: false to hide a tab without deleting it.
     The first active campaign is shown by default on page load.
     ═══════════════════════════════════════════════════════════════════════════ */
  campaigns: [

    /* ── Campaign 1: Easter 2026 ──────────────────────────────────────────── */
    {
      id:          "easter-2026",
      label:       "Easter Break 2026",       // full label shown in desktop tab
      shortLabel:  "Easter '26",              // shorter label for mobile (not currently rendered separately — future use)
      active:      true,                      // false = tab is hidden entirely
      accentColor: "#c26d3b",                 // terracotta — used for active tab border + hero accent pill

      heroHeadline: "Easter family deals — personally picked for you",
      heroSub:      "Four destinations I've researched using live supplier pricing. No algorithms. Just an advisor who's done the legwork.",

      storyEyebrow: "From Aditi's desk",
      storyTitle:   "Why I put these deals together",
      storyParas: [
        "Easter is one of the busiest booking windows of the year — and one of the most confusing. Prices shift daily, comparison sites surface packages that don't reflect real availability, and it can take hours just to work out whether you're actually getting a good deal.",
        "So I did the searching for you. These four deals came out of research I did on my professional booking platform this week — real pricing, real availability, checked manually. They're not sponsored listings or affiliate links. They're simply the ones that stood out as good value for families heading away over Easter.",
        "If any of them look right for your family, get in touch and I'll check live availability, confirm current pricing, and put together a tailored quote. If none quite fits — different airport, different dates, different budget — that's fine too. That's exactly what I'm here for.",
      ],

      // Pre-fills the WhatsApp message when enquiring without a specific deal selected
      enquiryDefaultMessage: "Hi Aditi, I've seen your Easter 2026 deals page and I'd love some personalised options for my family. Can you help?",
    },

    /* ── Campaign 2: May Half Term 2026 — placeholder ─────────────────────
       This campaign is set to active: false, so no tab is shown.
       Flip to active: true and add deals with campaign: "may-2026" when ready.
    ────────────────────────────────────────────────────────────────────────── */
    {
      id:          "may-2026",
      label:       "May Half Term 2026",
      shortLabel:  "May '26",
      active:      false,                     // ← change to true when deals are ready
      accentColor: "#1f6f8b",                 // teal accent

      heroHeadline: "May Half Term 2026 — coming soon",
      heroSub:      "I'm putting options together now. Get in touch if you want me to start searching for your family's dates.",

      storyEyebrow: "From Aditi's desk",
      storyTitle:   "Deals coming soon",
      storyParas: [
        "I'm working on May Half Term options now. Watch this space — or get in touch if you want me to start searching for your family's dates.",
      ],

      enquiryDefaultMessage: "Hi Aditi, I'm interested in May Half Term 2026 options for my family. Can you help?",
    },

  ],


  /* ═══════════════════════════════════════════════════════════════════════════
     DEALS
     ═══════════════════════════════════════════════════════════════════════════
     Add new deals at the end of this array (before the closing `]`).
     To hide a deal without deleting it: change status to "draft".
     To reorder in Recommended view: set editorsPick: true on priority deals.
     ═══════════════════════════════════════════════════════════════════════════ */
  deals: [

      // ── Stalis, Crete Heraklion Area · Maria Lambis Apartments ──────────────────────────────
  {
    id:            "maria-lambis-apartments-stalis-crete-heraklion-are",
    campaign:      "easter-2026",    // ← update to match campaign id in deals.js
    travelDateRaw: "",               // ← REQUIRED for auto-expiry: "YYYY-MM-DD" e.g. "2026-04-03"
    status:        "draft",         // ← change to "live" when ready to publish

    badge:         "Best Value",
    badgeStyle:    "blue",          // green | blue | terra | amber
    editorsPick:   false,

    destination:   "Stalis, Crete Heraklion Area",
    region:        "",              // ← optional: area name e.g. "Heraklion Area"
    hotelName:     "Maria Lambis Apartments",
    starRating:    3,
    roomType:      "Apartment - Sleeps up to 4",
    boardBasis:    "Self Catering",

    nights:        4,
    travelDate:    "3rd Apr 2026",
    returnDate:    "",              // ← fill in e.g. "10 Apr 2026"
    flightSummary: "Out: London Stansted STN to Crete (Heraklion) HER | dep Fri 3rd Apr 15:30 | arr 21:35 | Back: Crete HER to London STN | dep Tue 7th Apr 12:55 | arr 15:05",

    totalPrice:    1557,
    pricePerPerson: 517,
    wasPrice:      null,
    currency:      "GBP",

    includes: [
      "1 x Free Child Place",
      "Coach Transfers",
      "4 x 10kg Hand Baggage",
      "4 x 22kg Bag Allowance",
    ],

    highlights: [
      "Traditional charm",
      "Quiet and relaxing location",
      "Set in pretty gardens",
      "Free Wi-Fi",
    ],

    whyIPicked: "",  // ← add your personal note here (shown italic on card)

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "",  // ← e.g. "London Gatwick"

    category: ["family", "beach"],  // ← beach | all-inclusive | self-catering | half-board

    ctaLabel: "Ask about this deal",
  },

  // ── Analipsis, Crete Heraklion Area · Stella Village Seaside Hotel ──────────────────────────────
  {
    id:            "stella-village-seaside-hotel-analipsis-crete-herak",
    campaign:      "easter-2026",    // ← update to match campaign id in deals.js
    travelDateRaw: "",               // ← REQUIRED for auto-expiry: "YYYY-MM-DD" e.g. "2026-04-03"
    status:        "draft",         // ← change to "live" when ready to publish

    badge:         "Premium",
    badgeStyle:    "blue",          // green | blue | terra | amber
    editorsPick:   false,

    destination:   "Analipsis, Crete Heraklion Area",
    region:        "",              // ← optional: area name e.g. "Heraklion Area"
    hotelName:     "Stella Village Seaside Hotel",
    starRating:    4,
    roomType:      "Family room",
    boardBasis:    "All Inclusive",

    nights:        4,
    travelDate:    "3rd Apr 2026",
    returnDate:    "",              // ← fill in e.g. "10 Apr 2026"
    flightSummary: "Out: London Gatwick LGW to Crete (Heraklion) HER | dep Fri 3rd Apr 2026 08:20 | arr Fri 3rd Apr 2026 14:50 | Back: Crete HER to London LGW | dep Tue 7th Apr 2026 14:05 | arr Tue 7th Apr 2026 16:25",

    totalPrice:    2151,
    pricePerPerson: 705,
    wasPrice:      null,
    currency:      "GBP",

    includes: [
      "1 x Free Child Place",
      "Coach Transfers",
      "4 x 10kg Hand Baggage",
      "4 x 22kg Bag Allowance",
    ],

    highlights: [
      "On-site waterpark",
      "Family rooms available",
      "Great value All Inclusive",
      "Perfect for all ages",
      "Excellent children's facilities",
      "Free Wi-Fi",
    ],

    whyIPicked: "",  // ← add your personal note here (shown italic on card)

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "",  // ← e.g. "London Gatwick"

    category: ["family", "beach"],  // ← beach | all-inclusive | self-catering | half-board

    ctaLabel: "Ask about this deal",
  },

  // ── Fuengirola, Costa Del Sol · Ramada Hotel Suites Costa Del Sol ──────────────────────────────
  {
    id:            "ramada-hotel-suites-costa-del-sol-fuengirola-costa",
    campaign:      "easter-2026",    // ← update to match campaign id in deals.js
    travelDateRaw: "",               // ← REQUIRED for auto-expiry: "YYYY-MM-DD" e.g. "2026-04-03"
    status:        "draft",         // ← change to "live" when ready to publish

    badge:         "Our Pick",
    badgeStyle:    "blue",          // green | blue | terra | amber
    editorsPick:   false,

    destination:   "Fuengirola, Costa Del Sol",
    region:        "",              // ← optional: area name e.g. "Heraklion Area"
    hotelName:     "Ramada Hotel Suites Costa Del Sol",
    starRating:    3,
    roomType:      "Superior Two Bedroom apartment",
    boardBasis:    "Self Catering",

    nights:        4,
    travelDate:    "5th Apr 2026",
    returnDate:    "",              // ← fill in e.g. "10 Apr 2026"
    flightSummary: "Out: London Gatwick LGW to Malaga AGP | dep Sun 5th Apr 2026 at 08:05 | arr 12:10 | Back: Malaga AGP to London Gatwick LGW | dep Thu 9th Apr 2026 at 13:00 | arr 14:50",

    totalPrice:    1341,
    pricePerPerson: 447,
    wasPrice:      null,
    currency:      "GBP",

    includes: [
      "1 x Free Child Place",
      "Coach Transfers",
      "4 x 10kg Hand Baggage",
      "4 x 22kg Bag Allowance",
    ],

    highlights: [
      "Great entertainment",
      "Perfect for families",
      "Close to the beach",
      "On-site pizzeria and bakery",
      "Well-equipped apartments",
      "Free Wi-Fi",
    ],

    whyIPicked: "",  // ← add your personal note here (shown italic on card)

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "",  // ← e.g. "London Gatwick"

    category: ["family", "beach"],  // ← beach | all-inclusive | self-catering | half-board

    ctaLabel: "Ask about this deal",
  },

  // ── Fuengirola, Costa Del Sol · Wyndham Grand Costa Del Sol ──────────────────────────────
  {
    id:            "wyndham-grand-costa-del-sol-fuengirola-costa-del-s",
    campaign:      "easter-2026",    // ← update to match campaign id in deals.js
    travelDateRaw: "",               // ← REQUIRED for auto-expiry: "YYYY-MM-DD" e.g. "2026-04-03"
    status:        "draft",         // ← change to "live" when ready to publish

    badge:         "Our Pick",
    badgeStyle:    "blue",          // green | blue | terra | amber
    editorsPick:   false,

    destination:   "Fuengirola, Costa Del Sol",
    region:        "",              // ← optional: area name e.g. "Heraklion Area"
    hotelName:     "Wyndham Grand Costa Del Sol",
    starRating:    3,
    roomType:      "Deluxe One Bedroom suite",
    boardBasis:    "",

    nights:        4,
    travelDate:    "5th Apr 2026",
    returnDate:    "",              // ← fill in e.g. "10 Apr 2026"
    flightSummary: "Out: London Gatwick LGW to Malaga AGP | dep Sun 5th Apr 2026 at 08:05 | arr 12:10 | Back: Malaga AGP to London Gatwick LGW | dep Thu 9th Apr 2026 at 13:00 | arr 14:50",

    totalPrice:    1592,
    pricePerPerson: 398,
    wasPrice:      null,
    currency:      "GBP",

    includes: [
      "4 x 10kg Hand Baggage",
      "4 x 22kg Bag Allowance",
      "Coach Transfers",
    ],

    highlights: [
      "Wide range of facilities available",
      "Close to the beach",
      "Great for self catering",
      "Well-maintained gardens",
      "Relaxed atmosphere",
      "Free Wi-Fi",
    ],

    whyIPicked: "",  // ← add your personal note here (shown italic on card)

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "",  // ← e.g. "London Gatwick"

    category: ["family", "beach"],  // ← beach | all-inclusive | self-catering | half-board

    ctaLabel: "Ask about this deal",
  },
     


    /*
     * ── Add new deals above this comment ─────────────────────────────────────
     * Copy the DEAL TEMPLATE below, paste it here (before this comment),
     * and add a comma after the previous deal's closing `}`.
     */

  ],

};


/* ═══════════════════════════════════════════════════════════════════════════════
   DEAL TEMPLATE — copy and paste to add a new deal
   ═══════════════════════════════════════════════════════════════════════════════
   Instructions:
   1. Copy everything between the START and END markers below.
   2. Paste it into the deals array above (before the closing `]`).
   3. Add a comma after the previous deal's closing `}`.
   4. Fill in all fields. Change status to "live" when ready to publish.
   5. If you want a custom card gradient colour, add the id keyword to the
      cardGradient() map in deals.html (e.g. 'rhodes': 'linear-gradient(...)').

   ── START DEAL TEMPLATE ──────────────────────────────────────────────────────

  {
    id:            "destination-hotel-slug",  // unique, lowercase, hyphens only
    campaign:      "easter-2026",             // must match a campaign id above
    travelDateRaw: "2026-04-18",              // YYYY-MM-DD — drives auto-expiry

    status:        "draft",                   // change to "live" to publish

    badge:         "Your badge text",         // e.g. "Great value", "Editor's pick"
    badgeStyle:    "green",                   // "green" | "blue" | "terra" | "amber"
    editorsPick:   false,

    destination:   "Resort, Country",
    region:        "Area Name",
    hotelName:     "Full Hotel Name",
    starRating:    4,                         // 1–5, or 0 to omit stars
    roomType:      "Room description",
    boardBasis:    "All Inclusive",           // "All Inclusive" | "Half Board" | "Self Catering" | "Bed & Breakfast"

    nights:        7,
    travelDate:    "18 Apr 2026",             // human-readable, shown on card
    returnDate:    "25 Apr 2026",
    flightSummary: "London Gatwick (LGW) → Destination (XXX)",

    totalPrice:    2500,                      // total for the party (integer GBP)
    pricePerPerson: 625,
    wasPrice:      null,                      // integer if showing a saving, otherwise null
    currency:      "GBP",

    includes: [
      "Return flights from Gatwick",
      "20kg Baggage per person",
      "Resort transfers",
    ],

    highlights: [
      "Highlight one",
      "Highlight two",
      "Highlight three",
    ],

    whyIPicked: "Your personal note about why this deal is worth considering. 2–3 sentences.",

    familyFriendly:   true,
    flightsIncluded:  true,
    departureAirport: "London Gatwick",

    category: ["family", "beach", "all-inclusive"],
                                              // values: "beach" | "all-inclusive" | "self-catering" | "half-board" | "family"

    ctaLabel: "Ask about this deal",
  },

   ── END DEAL TEMPLATE ────────────────────────────────────────────────────────
*/


/* ═══════════════════════════════════════════════════════════════════════════════
   CAMPAIGN TEMPLATE — copy and paste to add a new campaign tab
   ═══════════════════════════════════════════════════════════════════════════════
   Instructions:
   1. Copy everything between the START and END markers below.
   2. Paste it into the campaigns array above (before the closing `]`).
   3. Add a comma after the previous campaign's closing `}`.
   4. Give it a unique id and fill in all fields.
   5. Set active: true when you're ready for the tab to appear.
   6. Add deals with `campaign` matching your new id.

   ── START CAMPAIGN TEMPLATE ──────────────────────────────────────────────────

  {
    id:          "summer-2026",               // unique id — match this in deal.campaign fields
    label:       "Summer 2026",               // full tab label
    shortLabel:  "Summer '26",               // shorter label (future mobile use)
    active:      false,                       // true = tab visible | false = tab hidden

    accentColor: "#c26d3b",                   // active tab colour: "#c26d3b" terra | "#1f6f8b" teal

    heroHeadline: "Summer 2026 deals — coming soon",
    heroSub:      "I'm putting options together now. Get in touch if you'd like me to start searching for your dates.",

    storyEyebrow: "From Aditi's desk",
    storyTitle:   "Summer 2026",
    storyParas: [
      "I'm working on Summer 2026 deals now. Watch this space — or get in touch and I'll start searching for your family's specific dates and airport.",
    ],

    enquiryDefaultMessage: "Hi Aditi, I'm interested in Summer 2026 holiday options for my family. Can you help?",
  },

   ── END CAMPAIGN TEMPLATE ─────────────────────────────────────────────────────
*/
