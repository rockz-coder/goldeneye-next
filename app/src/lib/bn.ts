/* Bangla UI strings for the shared chrome and section headings (starter translation: have a native editor review before launch).
   Keys are the exact English text nodes in src/partials/*.html. Content from Payload is translated in /admin via localization. */
export const BN: Record<string, string> = {
  // header / menu
  Home: 'হোম',
  Projects: 'প্রকল্পসমূহ',
  'Our projects': 'আমাদের প্রকল্প',
  About: 'আমাদের সম্পর্কে',
  Services: 'সেবাসমূহ',
  News: 'সংবাদ',
  Careers: 'ক্যারিয়ার',
  Contact: 'যোগাযোগ',
  Call: 'কল করুন',
  WhatsApp: 'হোয়াটসঅ্যাপ',
  'Book a Site Visit': 'সাইট ভিজিট বুক করুন',
  'Book visit': 'ভিজিট বুক করুন',
  'Browse all properties →': 'সব প্রপার্টি দেখুন →',
  'Five addresses. One standard of care.': 'পাঁচটি ঠিকানা। একই মানের যত্ন।',
  'See details': 'বিস্তারিত দেখুন',
  'Skip to content': 'মূল অংশে যান',
  OFFER: 'অফার',
  'Book a Goldeneye Riviera apartment before 31 Dec and save up to 10%': '৩১ ডিসেম্বরের আগে গোল্ডেনআই রিভিয়েরায় অ্যাপার্টমেন্ট বুক করলে ১০% পর্যন্ত ছাড়',
  // footer
  'Quick Links': 'দ্রুত লিংক',
  'About Us': 'আমাদের কথা',
  'EMI Calculator': 'কিস্তি ক্যালকুলেটর',
  'NRB Desk': 'প্রবাসী ডেস্ক',
  'News &amp; Updates': 'সংবাদ ও আপডেট',
  'Privacy Policy': 'গোপনীয়তা নীতি',
  'Terms &amp; Conditions': 'শর্তাবলী',
  'Stay Updated': 'আপডেট পেতে থাকুন',
  'Building premium residential spaces and planned communities across Dhaka since 2009. RAJUK approved, trusted by 2,500+ families.':
    '২০০৯ সাল থেকে ঢাকা জুড়ে প্রিমিয়াম আবাসন ও পরিকল্পিত কমিউনিটি নির্মাণ করছি। রাজউক অনুমোদিত, ২,৫০০+ পরিবারের আস্থাভাজন।',
  '&copy; 2026 Goldeneye Developers Limited. All rights reserved.': '&copy; ২০২৬ গোল্ডেনআই ডেভেলপার্স লিমিটেড। সর্বস্বত্ব সংরক্ষিত।',
  // home headings
  'Four things you can check before you pay a single taka.': 'এক টাকা দেওয়ার আগেই যাচাই করতে পারেন এমন চারটি বিষয়।',
  'Five addresses across Dhaka': 'ঢাকা জুড়ে পাঁচটি ঠিকানা',
  'More than buildings. We build neighbourhoods.': 'শুধু ভবন নয়, আমরা গড়ি প্রতিবেশ।',
  'Seventeen years of keeping our word.': 'সতেরো বছর ধরে কথা রাখার ইতিহাস।',
  'Everything you need, a lift ride away.': 'প্রয়োজনের সবকিছু, লিফটের নাগালেই।',
  'A township drawn around a lake, not a car park.': 'গাড়ির পার্কিং নয়, লেককে ঘিরে পরিকল্পিত টাউনশিপ।',
  'Walk through your future home before it’s built.': 'তৈরি হওয়ার আগেই ঘুরে দেখুন আপনার ভবিষ্যৎ বাড়ি।',
  'See exactly where your home stands.': 'আপনার বাড়ির নির্মাণ এখন কোথায়, নিজের চোখে দেখুন।',
  'Know your monthly number before you visit.': 'ভিজিটের আগেই জেনে নিন মাসিক কিস্তির অঙ্ক।',
  'From first visit to keys in hand, in four steps.': 'প্রথম ভিজিট থেকে চাবি হাতে পাওয়া, চার ধাপে।',
  'Buying from abroad? Your home, without the flight.': 'প্রবাসে থাকেন? ফ্লাইট ছাড়াই কিনুন আপনার বাড়ি।',
  'What’s in writing, not in the brochure.': 'ব্রশিউরে নয়, চুক্তিতে লেখা প্রতিশ্রুতি।',
  'What our homeowners say': 'আমাদের গ্রাহকদের কথা',
  'See it in person. We’ll pick you up.': 'সরাসরি দেখে যান। আমরা নিয়ে আসব।',
  'Latest from Goldeneye': 'গোল্ডেনআই থেকে সর্বশেষ',
  'Questions buyers ask us first': 'ক্রেতারা সবার আগে যা জানতে চান',
  'Ready to find your ': 'আপনার ',
}

export function toBangla(html: string): string {
  let out = html
  for (const [en, bn] of Object.entries(BN)) out = out.split(`>${en}<`).join(`>${bn}<`)
  return out
}
