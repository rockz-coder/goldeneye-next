/* Placeholder project content for property.html (one entry per project). Replace with verified copy. */
const FAQ_COMMON = [
    ['Can I see the documents before I pay anything?', 'Yes. Every document listed on this page is shared with you and your lawyer before any booking money is taken.'],
    ['What are the registration costs?', 'Government registration fees, stamp duty and taxes are paid by the buyer at registration. We give you a written estimate with your price sheet.'],
    ['Can I visit the site?', 'Free site visits run seven days a week. Book one from the form and we arrange pick-up from your area on request.']
];
const GALLERY_CATS = ['All', 'Exterior', 'Interior', 'Site', 'Amenities'];
const PLANS = [
    ['One-time payment', '5% discount', 'Full payment within 60 days of booking.'],
    ['Most chosen', '24 months', '10% booking, 20% down, the rest in 24 interest-free instalments.'],
    ['NRB flexi plan', '48 months', 'Quarterly payments timed to your remittance cycle.']
];

const DETAILS = {
    greenvalley: {
        id: 'greenvalley', kind: 'plot', name: 'Goldeneye Green Valley', short: 'Green Valley', area: 'Purbachal', loc: 'Kanchan, Purbachal', locLine: 'Kanchan, Purbachal · 7 min from the 300-ft expressway',
        hero: ['greenvalley', 'center'], tags: ['Hot deal · 20 plots left', 'RAJUK-approved layout', 'Plot · Township'], deal: 'Only 20 plots remain', cta: ['Explore plots', 'plot'],
        facts: [['Starting price', '৳40 Lakh', ' / katha'], ['Plot sizes', '3 · 5 · 10 katha', ''], ['Availability', '20', ' of 186 plots'], ['Plot handover', 'June 2027', '']],
        from: '৳40L / katha', sold: [166, 186], progress: 80, progressNote: 'ahead of schedule',
        overview: ['Land you can build a family home on — with the roads, drains and paperwork already done.', 'Green Valley is a 42-bigha gated township in Purbachal, planned around a 3-acre lake park. Plots come with a RAJUK-approved layout, underground electricity and water, 40-ft and 25-ft paved roads and a single, clean title. You can start construction the day your plot is registered.'],
        stats: [['Land area', '42 bigha'], ['Total plots', '186 in 6 blocks'], ['Main road', '40 ft avenue'], ['Open space', '38%'], ['Utilities', 'Underground'], ['Approval', 'RAJUK [No. ___]']],
        amenities: ['Lake park & jogging track', 'Gated entry, 24/7 guards', 'CCTV on every road', 'Mosque', 'School plot', 'Community centre', 'Shops & clinic strip', 'Kids’ playground', 'Street lighting', 'Storm drainage'],
        masterplan: { img: ['masterplan', 'center'], alt: 'Green Valley master plan with six blocks around a central lake', spots: [[22, 30, 'Block A — Lake front', 'South-facing 5 and 10 katha plots beside the lake park.'], [50, 24, 'Block B — Avenue', '3 and 5 katha plots on the 40-ft avenue.'], [74, 40, 'Block C — Garden', 'Quiet 25-ft internal roads, mostly 3 katha plots.'], [44, 66, 'Lake park', 'A 3-acre lake park with a jogging track and playground.'], [78, 74, 'Main gate', 'Gated entry, security lodge and visitor parking.']] },
        layouts: [[3, 3, 'Compact family home', '60% ground coverage · FAR 3.0', 'Typical: 36 ft × 90 ft'], [5, 5, 'Duplex family home', '60% ground coverage · FAR 3.5', 'Typical: 45 ft × 100 ft'], [10, 10, 'Large villa or two-unit home', '55% ground coverage · FAR 3.5', 'Typical: 60 ft × 120 ft']],
        timeline: [['22 OCT 2026 · NOW', 'Main avenue paving complete', 'All 40-ft roads paved; street lights energised in Blocks A–C. Lake park planting 60% done.', ['greenvalley', 'center']], ['JUN 2026', 'Underground utilities laid', 'Electricity and water lines installed before paving, so no road cutting later.', ['masterplan', 'center']], ['AUG 2025', 'Land filling & compaction', 'Filled to 2 ft above the highest recorded flood level, with soil-test reports for every block.'], ['TARGET · JUN 2027', 'Plot handover & registration', 'Boundary pillars, demarcation certificate and registered deed for every plot.']],
        nearby: [['300-ft Expressway', 'Road', '1.8 km', '5 min drive'], ['International school (planned)', 'Education', '2.5 km', '7 min drive'], ['General hospital', 'Health', '4.0 km', '10 min drive'], ['Kuril / Jamuna Future Park', 'Shopping', '14 km', '25 min drive'], ['Hazrat Shahjalal Airport', 'Travel', '16 km', '30 min drive']],
        roadLbl: 'Purbachal 300-ft Expressway',
        docs: [['RAJUK layout approval', 'Verified · Ref [____]'], ['CS · SA · RS · BS khatian', 'Verified'], ['25-year title chain', 'Verified by [Law firm]'], ['Mutation & DCR', 'Verified'], ['Soil test report', 'All 6 blocks'], ['Non-encumbrance certificate', 'No liens or loans']],
        why: ['Why Purbachal, why now', ['Dhaka’s largest planned new town, connected by the 300-ft expressway.', 'Planned metro rail and diplomatic zone nearby (government plans; timelines may change).', 'Ready infrastructure means you can build immediately — no waiting for roads.', 'Price-trend data: [add verified Purbachal land-price figures].']],
        quote: ['“Clean title, clear boundaries and roads already built. The first plot in my family that didn’t come with a court case.”', 'Dr. Nasreen Akter · 5 katha, Block A'],
        faq: [['When can I start building my house?', 'As soon as your plot is registered in your name. Utilities are already underground, so you only need your building plan approved.'], ['Is the corner premium negotiable?', 'The 10% corner premium is fixed across all buyers. You can choose a non-corner plot in the same block instead.'], ...FAQ_COMMON],
        gallery: [['greenvalley', 'center', 'Aerial view of paved roads and demarcated plots', 'Site'], ['greenvalley', 'right center', 'Green belt along the main avenue', 'Exterior'], ['masterplan', 'center', 'Master plan with six blocks', 'Site'], ['tour', 'center', 'Lake park concept render', 'Amenities'], ['greenvalley', 'left bottom', 'Boundary pillars and road edge', 'Site'], ['nrb', 'center', 'Community centre concept', 'Amenities'], ['interior', 'center', 'Sample home interior on a 5 katha plot', 'Interior'], ['greenvalley', 'left top', 'Street lighting along Block A', 'Exterior']]
    },
    heights: {
        id: 'heights', kind: 'unit', name: 'Goldeneye Heights', short: 'Heights', area: 'Bashundhara', loc: 'Block D, Bashundhara R/A', locLine: 'Block D, Bashundhara R/A · 4 min from the main road',
        hero: ['heights', 'center 30%'], tags: ['Ready to move', 'RAJUK-approved', 'Apartments'], deal: 'Only 9 homes remain', cta: ['Explore homes', 'plot'],
        facts: [['Starting price', '৳1.15 Crore', ''], ['Home sizes', '1,650 – 3,400 sqft', ''], ['Availability', '9', ' of 96 homes'], ['Handover', 'Ready now', '']],
        from: '৳1.15 Cr', sold: [87, 96], progress: 100, progressNote: 'handed over in 2025',
        overview: ['A finished tower with a track record: move in this month, not in three years.', 'Heights is a 21-storey residential tower with south-facing homes, a podium pool and gym, and a generator for every flat. Every owner already holds a registered deed.'],
        stats: [['Floors', '21 storeys'], ['Total homes', '96 homes'], ['Lifts', '3 per core'], ['Parking', '1.2 per home'], ['Power', '100% backup'], ['Approval', 'RAJUK [No. ___]']],
        amenities: ['Podium pool', 'Gym & yoga room', 'Rooftop lounge', '100% generator backup', 'CCTV & security', 'Children’s play area', 'Prayer room', 'Visitor parking', 'Fire-safety systems', 'Community hall'],
        masterplan: null, layouts: null,
        timeline: [['2025', 'Handover & registration', 'Keys handed over; deeds registered for every sold home.', ['heights', 'center 30%']], ['2024', 'Finishing & fit-out', 'Tiling, joinery and lift commissioning completed floor by floor.'], ['2022', 'Structure complete', 'Reinforced concrete frame topped out with third-party strength tests.'], ['2021', 'Foundation', 'Piling and basement completed after full soil investigation.']],
        nearby: [['Bashundhara City Mall', 'Shopping', '1.2 km', '5 min drive'], ['North South University', 'Education', '1.5 km', '6 min drive'], ['Evercare Hospital', 'Health', '2.0 km', '8 min drive'], ['Airport', 'Travel', '9 km', '25 min drive']],
        roadLbl: 'Kuril–Purbachal 300 ft',
        docs: [['RAJUK building approval', 'Verified · Ref [____]'], ['Land title chain', 'Verified by [Law firm]'], ['Fire-service clearance', 'Issued'], ['Occupancy certificate', 'Issued'], ['Structural design report', 'Third-party audited'], ['Non-encumbrance certificate', 'No liens or loans']],
        why: ['Why Bashundhara', ['Established neighbourhood with schools, hospitals and malls within minutes.', 'Ready home: no construction wait, no rent while you wait.', 'Registered deeds and utilities already in place.', 'Price-trend data: [add verified Bashundhara price figures].']],
        quote: ['“We moved in within a month of paying. What they promised on paper is what we got.”', 'Mr. Imran Hossain · 3 bed, Type A'],
        faq: [['Can I move in immediately?', 'Yes. Homes are ready; after payment and registration we hand over the keys.'], ['Is parking included?', 'One car space is included with every home; a second can be added subject to availability.'], ...FAQ_COMMON],
        gallery: [['heights', 'center 30%', 'Heights tower at sunset', 'Exterior'], ['heights', 'center 60%', 'Tower façade and balconies', 'Exterior'], ['interior', 'center', 'Living room of a 3 bed home', 'Interior'], ['tour', 'center', 'Podium pool deck', 'Amenities'], ['heights', 'center 5%', 'Sky penthouse terrace level', 'Exterior'], ['interior', 'left center', 'Master bedroom', 'Interior'], ['nrb', 'center', 'Community hall', 'Amenities'], ['heights', 'right 85%', 'Neighbourhood approach', 'Site']]
    },
    riviera: {
        id: 'riviera', kind: 'unit', name: 'Goldeneye Riviera', short: 'Riviera', area: 'Purbachal', loc: 'Sector 15, Purbachal New Town', locLine: 'Sector 15, Purbachal New Town · lakeside',
        hero: ['riviera', 'center'], tags: ['Under construction · 62% built', 'RAJUK-approved', 'Apartments'], deal: 'Pre-launch prices end 31 Dec', cta: ['Explore homes', 'plot'],
        facts: [['Starting price', '৳85 Lakh', ''], ['Home sizes', '1,250 – 2,400 sqft', ''], ['Availability', '31', ' of 144 homes'], ['Handover', '2027', '']],
        from: '৳85L', sold: [113, 144], progress: 62, progressNote: 'on schedule',
        overview: ['Lake-view living in Purbachal, priced before the neighbourhood fills in.', 'Riviera is a three-tower lakeside community with a shared podium, lake promenade and club. Construction updates are published every month with photos.'],
        stats: [['Towers', '3 towers'], ['Total homes', '144 homes'], ['Lake frontage', '220 m'], ['Open space', '55%'], ['Parking', '1.3 per home'], ['Approval', 'RAJUK [No. ___]']],
        amenities: ['Lake promenade', 'Infinity pool', 'Clubhouse', 'Gym & spa', 'Co-working lounge', 'Children’s play area', 'Jogging track', 'Visitor parking', '100% generator backup', 'CCTV & security'],
        masterplan: { img: ['masterplan', 'left top'], alt: 'Riviera site plan with three towers beside the lake', spots: [[26, 38, 'Tower 1', 'Lake-front tower with 2 and 3 bed homes.'], [50, 32, 'Tower 2', 'Central tower with the clubhouse podium.'], [72, 44, 'Tower 3', '4 bed duplexes with lake-front terraces.'], [46, 74, 'Lake promenade', 'A 220 m public-facing promenade for residents.']] },
        layouts: null,
        timeline: [['OCT 2026 · NOW', 'Tower 2 structure at level 14', '62% of structure complete across all towers; façade work starting on Tower 1.', ['riviera', 'center']], ['MAR 2026', 'Tower 1 topped out', 'Reinforced concrete frame complete with third-party strength tests.'], ['AUG 2025', 'Piling & basement', 'Foundations completed after full soil investigation.'], ['TARGET · 2027', 'Handover & registration', 'Keys, completion certificate and registered deeds.']],
        nearby: [['300-ft Expressway', 'Road', '2.0 km', '6 min drive'], ['International school (planned)', 'Education', '1.5 km', '5 min drive'], ['General hospital', 'Health', '4.5 km', '12 min drive'], ['Kuril / Jamuna Future Park', 'Shopping', '14 km', '25 min drive'], ['Airport', 'Travel', '16 km', '30 min drive']],
        roadLbl: 'Purbachal 300-ft Expressway',
        docs: [['RAJUK building approval', 'Verified · Ref [____]'], ['Land title chain', 'Verified by [Law firm]'], ['Structural design report', 'Third-party audited'], ['Soil test report', 'Completed'], ['Mutation & DCR', 'Verified'], ['Non-encumbrance certificate', 'No liens or loans']],
        why: ['Why Purbachal, why now', ['Dhaka’s largest planned new town, connected by the 300-ft expressway.', 'Lake-front towers are rare; most Purbachal buildings face a street.', 'Prices today are pre-launch; later phases will be priced higher.', 'Price-trend data: [add verified Purbachal figures].']],
        quote: ['“The monthly photo updates are what convinced me. I could see my floor going up.”', 'Ms. Farzana Rahman · 3 bed, Tower 1'],
        faq: [['What if handover is delayed?', 'The sales agreement states the handover date and the compensation for delay in writing.'], ['Can I change my floor plan?', 'Layout changes are possible until the partition stage, subject to structural limits.'], ...FAQ_COMMON],
        gallery: [['riviera', 'center', 'Riviera towers beside the lake', 'Exterior'], ['riviera', 'right center', 'Tower 3 and the promenade', 'Exterior'], ['tour', 'center', 'Lake promenade render', 'Amenities'], ['interior', 'left center', 'Show-flat living room', 'Interior'], ['riviera', 'left bottom', 'Construction at level 14', 'Site'], ['interior', 'center', 'Show-flat kitchen', 'Interior'], ['masterplan', 'left top', 'Site plan', 'Site'], ['nrb', 'center', 'Clubhouse lounge', 'Amenities']]
    },
    orchid: {
        id: 'orchid', kind: 'unit', name: 'Goldeneye Orchid', short: 'Orchid', area: 'Uttara', loc: 'Sector 4, Uttara', locLine: 'Sector 4, Uttara · near Metro Rail station',
        hero: ['orchid', 'center'], tags: ['Limited units', 'RAJUK-approved', 'Duplex'], deal: 'Only 6 duplexes remain', cta: ['Explore homes', 'plot'],
        facts: [['Starting price', '৳2.4 Crore', ''], ['Home sizes', '3,200 sqft', ''], ['Availability', '6', ' of 24 duplexes'], ['Handover', '2028', '']],
        from: '৳2.4 Cr', sold: [18, 24], progress: 35, progressNote: 'on schedule',
        overview: ['A low-rise garden address in Uttara, with only 24 families in the whole building.', 'Orchid is a six-storey garden duplex building with private terraces, a shared courtyard and a car-lift-free ground parking.'],
        stats: [['Floors', '6 storeys'], ['Total homes', '24 duplexes'], ['Garden', '40% open'], ['Parking', '2 per home'], ['Power', '100% backup'], ['Approval', 'RAJUK [No. ___]']],
        amenities: ['Private terrace', 'Shared courtyard garden', 'Rooftop lounge', 'Gym', '2 car spaces per home', 'CCTV & security', 'Generator backup', 'Prayer room'],
        masterplan: null, layouts: null,
        timeline: [['OCT 2026 · NOW', 'Structure at level 3', 'Frame complete up to level 3; brickwork starting on the ground floor.', ['orchid', 'center']], ['MAY 2026', 'Foundation complete', 'Raft foundation poured after soil investigation.'], ['TARGET · 2028', 'Handover & registration', 'Keys and registered deeds.']],
        nearby: [['Uttara Metro Rail station', 'Transit', '0.9 km', '4 min drive'], ['Airport', 'Travel', '4 km', '12 min drive'], ['International school', 'Education', '1.1 km', '5 min drive'], ['Hospital', 'Health', '2.5 km', '9 min drive']],
        roadLbl: 'Uttara Sector 4 main road',
        docs: [['RAJUK building approval', 'Verified · Ref [____]'], ['Land title chain', 'Verified by [Law firm]'], ['Soil test report', 'Completed'], ['Non-encumbrance certificate', 'No liens or loans']],
        why: ['Why Uttara', ['Metro Rail access to Motijheel and Agargaon.', 'Low-rise density: 24 homes instead of a 200-unit tower.', 'Established schools, hospitals and markets.', 'Price-trend data: [add verified Uttara figures].']],
        quote: ['“A real garden, a real neighbourhood, and only a few families on the staircase.”', 'Mr. Kamal Uddin · Duplex, Block B'],
        faq: [['Are the duplexes customisable?', 'Interior layout can be changed until partition stage.'], ...FAQ_COMMON],
        gallery: [['orchid', 'center', 'Orchid garden duplex at dusk', 'Exterior'], ['interior', 'center', 'Duplex living room', 'Interior'], ['orchid', 'left center', 'Courtyard entrance', 'Exterior'], ['tour', 'center', 'Rooftop lounge render', 'Amenities']]
    },
    horizon: {
        id: 'horizon', kind: 'unit', name: 'Goldeneye Horizon', short: 'Horizon', area: 'Tejgaon', loc: 'Tejgaon I/A', locLine: 'Tejgaon I/A · next to the Tejgaon–Gulshan link road',
        hero: ['heights', 'right 85%'], tags: ['Launching 2027', 'Commercial', 'Offices & retail'], deal: 'Early-bird floors open', cta: ['Explore floors', 'plot'],
        facts: [['Starting price', '৳1.9 Crore', ''], ['Unit sizes', '1,200 – 2,800 sqft', ''], ['Availability', 'Pre-launch', ''], ['Handover', '2029', '']],
        from: '৳1.9 Cr', sold: [0, 60], progress: 5, progressNote: 'design stage',
        overview: ['A commercial tower in Tejgaon, planned around how offices actually work.', 'Horizon offers full office floors and ground-floor retail with its own basement parking and backup power. Details are subject to approval.'],
        stats: [['Floors', '18 storeys'], ['Office floors', '14'], ['Retail', 'Ground + 1'], ['Parking', '3 basements'], ['Power', '100% backup'], ['Approval', 'In process']],
        amenities: ['Basement parking', 'High-speed lifts', 'Backup power', 'Food court', 'CCTV & security', 'Fire-safety systems'],
        masterplan: null, layouts: null,
        timeline: [['2027', 'Launch', 'Sales launch and groundbreaking.'], ['2029', 'Target handover', 'Subject to approvals.']],
        nearby: [['Tejgaon–Gulshan link road', 'Road', '0.3 km', '2 min drive'], ['Karwan Bazar', 'Business', '2.0 km', '8 min drive'], ['Airport', 'Travel', '7 km', '20 min drive']],
        roadLbl: 'Tejgaon I/A main road',
        docs: [['Land title chain', 'In verification'], ['RAJUK approval', 'Applied']],
        why: ['Why Tejgaon', ['Central location between Gulshan, Banani and Motijheel.', 'Established commercial district.', 'Parking and power built in from day one.', 'Pricing: [add verified commercial price figures].']],
        quote: ['“We are already registering interest for two floors.”', 'Early-interest enquiry'],
        faq: [['When will sales open?', 'We plan a 2027 launch. Register interest to be called first.'], ...FAQ_COMMON],
        gallery: [['heights', 'right 85%', 'Horizon tower render', 'Exterior'], ['heights', 'left 70%', 'Podium and entrance render', 'Exterior'], ['interior', 'center', 'Sample office fit-out', 'Interior'], ['tour', 'center', 'Food court render', 'Amenities']]
    }
};
