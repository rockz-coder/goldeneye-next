/* Shared placeholder content for the home page. Replace with real project details. */
const PROJECTS = (window.__GD && window.__GD.PROJECTS) || [
    { id: 'heights', key: 'ready', name: 'Goldeneye Heights', loc: 'Block D, Bashundhara R/A', type: 'Apartment', badge: 'Ready to move', badgeCls: 'ok', specs: ['3–4 bed', '1,650–2,150 sqft', 'G+14'], progLabel: 'Units sold', prog: 77, price: '৳1.15 Crore', img: 'images/heights.jpg', pos: 'center 30%', alt: 'Goldeneye Heights tower at golden hour', href: 'property.html?id=heights' },
    { id: 'riviera', key: 'construction', name: 'Goldeneye Riviera', loc: 'Sector 15, Purbachal New Town', type: 'Apartment', badge: '10% off', badgeCls: 'gold', specs: ['2–4 bed', '1,250–2,400 sqft', 'Lakeside'], progLabel: 'Construction', prog: 62, price: '৳85 Lakh', img: 'images/riviera.jpg', pos: 'center', alt: 'Riviera residential towers beside a lake', href: 'property.html?id=riviera' },
    { id: 'greenvalley', key: 'plots', name: 'Goldeneye Green Valley', loc: 'Kanchan, Purbachal', type: 'Plot', badge: 'Hot deal', badgeCls: 'ink', specs: ['3, 5 & 10 katha', 'RAJUK layout', '186 plots'], progLabel: 'Development', prog: 80, price: '৳40 Lakh / katha', img: 'images/greenvalley.jpg', pos: 'center', alt: 'Aerial view of Green Valley plots and roads', href: 'property.html?id=greenvalley' },
    { id: 'orchid', key: 'construction', name: 'Goldeneye Orchid', loc: 'Sector 4, Uttara', type: 'Duplex', badge: 'Limited units', badgeCls: 'warn', specs: ['4 bed duplex', '3,200 sqft', 'Private garden'], progLabel: 'Construction', prog: 35, price: '৳2.4 Crore', img: 'images/orchid.jpg', pos: 'center', alt: 'Orchid duplex with pool at dusk', href: 'property.html?id=orchid' },
    { id: 'horizon', key: 'upcoming', name: 'Goldeneye Horizon', loc: 'Tejgaon I/A', type: 'Commercial', badge: 'Launching 2027', badgeCls: 'white', specs: ['Office floors', '2,800–6,000 sqft', 'G+20'], progLabel: 'Pre-launch registrations', prog: 18, price: '৳3.2 Crore', img: 'images/heights.jpg', pos: 'right 85%', alt: 'Horizon commercial tower concept', href: 'properties.html?project=Horizon' }
];
const PROJECT_FILTERS = [['all', 'All'], ['ready', 'Ready to move'], ['construction', 'Under construction'], ['plots', 'Plots'], ['upcoming', 'Upcoming']];

const TRACKER = (window.__GD && window.__GD.TRACKER && window.__GD.TRACKER.length && window.__GD.TRACKER) || [
    { label: 'Riviera', name: 'Goldeneye Riviera', loc: 'Sector 15, Purbachal · Handover Dec 2027', pct: 62, note: 'On schedule · Floor 11 of 18 cast', stage: 2, dates: ['Mar 2025', 'Oct 2026', 'Feb 2027', 'Aug 2027', 'Dec 2027'],
      photos: [{ date: '28 Oct 2026', title: 'Tower B — 11th floor slab cast', img: 'images/riviera.jpg', pos: 'left center' }, { date: '14 Oct 2026', title: 'Lake edge landscaping begins', img: 'images/riviera.jpg', pos: 'right bottom' }, { date: '30 Sep 2026', title: 'Show flat interior complete', img: 'images/interior.jpg', pos: 'center' }] },
    { label: 'Green Valley', name: 'Goldeneye Green Valley', loc: 'Kanchan, Purbachal · Plot handover Jun 2027', pct: 80, note: 'Ahead of schedule · Roads 90% paved', stage: 3, dates: ['Jan 2024', 'Aug 2025', 'Jun 2026', 'Mar 2027', 'Jun 2027'],
      photos: [{ date: '22 Oct 2026', title: 'Main avenue paving finished', img: 'images/greenvalley.jpg', pos: 'center' }, { date: '02 Oct 2026', title: 'Lake park planting, phase 2', img: 'images/greenvalley.jpg', pos: 'right top' }, { date: '18 Sep 2026', title: 'Boundary demarcation, Block D', img: 'images/masterplan.jpg', pos: 'right bottom' }] },
    { label: 'Orchid', name: 'Goldeneye Orchid', loc: 'Sector 4, Uttara · Handover Mar 2028', pct: 35, note: 'On schedule · Structure, level 2', stage: 1, dates: ['Jun 2026', 'Jan 2027', 'Jun 2027', 'Dec 2027', 'Mar 2028'],
      photos: [{ date: '25 Oct 2026', title: 'Ground floor columns poured', img: 'images/orchid.jpg', pos: 'center' }, { date: '05 Oct 2026', title: 'Pile cap testing passed', img: 'images/orchid.jpg', pos: 'left bottom' }, { date: '15 Sep 2026', title: 'Garden layout approved', img: 'images/orchid.jpg', pos: 'right bottom' }] }
];
const TRACKER_STAGES = ['Foundation', 'Structure', 'Brickwork', 'Finishing', 'Handover'];

const MP_SPOTS = [
    { n: '1', x: 46, y: 46, tag: 'Central lake park', label: '3-acre lake & jogging loop', text: 'Every plot is within a 5-minute walk of the lake.' },
    { n: '2', x: 30, y: 22, tag: 'Block A · 5 katha', label: '6 plots available', text: 'South-facing, on the 40-ft avenue. From ৳2.05 Crore.' },
    { n: '3', x: 70, y: 74, tag: 'Block D · 3 katha', label: '9 plots available', text: 'Next to the school plot and mosque. From ৳1.2 Crore.' },
    { n: '4', x: 20, y: 80, tag: 'Commercial strip', label: 'Shops & clinic', text: 'Daily needs within the township gates.' }
];

const TESTIMONIALS = (window.__GD && window.__GD.TESTIMONIALS) || [
    { ini: 'FR', name: 'Farhana & Rezaul Karim', meta: 'Goldeneye Heights · Bashundhara', quote: 'They showed us every land paper before we paid a taka. Two years after moving in, the service engineer still answers on the first ring.' },
    { ini: 'SH', name: 'Shahidul Haque', meta: 'NRB buyer from Toronto · Riviera', quote: 'I booked by video call from Canada and watched my tower rise in the monthly photo reports. My parents moved in without me lifting a finger.' },
    { ini: 'NA', name: 'Dr. Nasreen Akter', meta: 'Green Valley · 5 katha plot', quote: 'Clean title, clear boundaries and roads already built. It’s the first plot purchase in my family that didn’t come with a court case.' },
    { ini: 'MI', name: 'Mahbub Islam', meta: 'Goldeneye Orchid · Uttara', quote: 'The price in the agreement is the price we paid. No “utility charge” surprises at handover — I compared three developers.' }
];

const VISIT_TYPES = [['On-site visit', 'Free pickup in Dhaka'], ['Video tour', 'Live on WhatsApp']];
const VISIT_SLOTS = ['10:00 am', '11:30 am', '2:00 pm', '3:30 pm', '5:00 pm'];
