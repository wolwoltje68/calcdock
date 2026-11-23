// Site chrome per language. First language = root of the site (/). Others live under /<lang>/.
export const langs = {
  en: {
    locale: 'en-US', currency: 'USD', dir: '',
    tagline: 'Free, fast online calculators',
    homeTitle: 'Free Online Calculators – Money, Math, Dates & Health',
    homeDesc: 'Fast, free and private online calculators: percentage, discount, VAT, compound interest, loan, salary, dates, age, BMI and grades.',
    homeIntro: 'Simple calculators that just work. No sign-up, no tracking of your input – everything is calculated in your browser.',
    cats: { money: 'Money', math: 'Math', work: 'Work', time: 'Date & time', health: 'Health', school: 'School' },
    result: 'Result', related: 'Related calculators', faq: 'Frequently asked questions', all: 'All calculators',
    privacy: 'Privacy', about: 'About', updated: 'Last updated', copy: 'Copy result', copied: 'Copied!',
    disclaimer: 'Results are for informational purposes only. No rights can be derived from them.',
    aboutTitle: 'About', aboutBody: `<p>This site offers free, simple calculators for everyday questions about money, math, dates and health. Every calculation runs locally in your browser – your numbers are never sent to a server.</p><p>Found a mistake or have an idea for a new calculator? Let us know via the contact address below.</p>`,
    privacyTitle: 'Privacy Policy',
  },
  nl: {
    locale: 'nl-NL', currency: 'EUR', dir: 'nl',
    tagline: 'Gratis, snelle online rekenhulpen',
    homeTitle: 'Gratis online rekenhulpen – geld, procenten, datums en meer',
    homeDesc: 'Snelle, gratis rekenhulpen: btw, procent, korting, rente op rente, lening, uurloon, datums, leeftijd, BMI en cijfers.',
    homeIntro: 'Eenvoudige calculators die gewoon werken. Geen account nodig – alles wordt in je eigen browser berekend.',
    cats: { money: 'Geld', math: 'Rekenen', work: 'Werk', time: 'Datum & tijd', health: 'Gezondheid', school: 'School' },
    result: 'Uitkomst', related: 'Gerelateerde rekenhulpen', faq: 'Veelgestelde vragen', all: 'Alle rekenhulpen',
    privacy: 'Privacy', about: 'Over ons', updated: 'Bijgewerkt', copy: 'Kopieer uitkomst', copied: 'Gekopieerd!',
    disclaimer: 'Uitkomsten zijn indicatief. Er kunnen geen rechten aan worden ontleend.',
    aboutTitle: 'Over ons', aboutBody: `<p>Deze site biedt gratis, eenvoudige rekenhulpen voor alledaagse vragen over geld, procenten, datums en gezondheid. Alle berekeningen gebeuren in je eigen browser – je gegevens worden nergens naartoe gestuurd.</p><p>Fout gevonden of een idee voor een nieuwe rekenhulp? Laat het ons weten via het contactadres hieronder.</p>`,
    privacyTitle: 'Privacyverklaring',
  },
};

export const privacyText = {
  en: (c) => `<p>Calculations on this site run entirely in your browser; the values you enter are not sent to or stored on our servers.</p>
<h2>Advertising</h2><p>${c.adsenseClient ? 'We use Google AdSense to show ads. Google and its partners may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising at <a href="https://adssettings.google.com" rel="nofollow">Google Ads Settings</a>. In the EU/UK you will be asked for consent first.' : 'This site may show advertising in the future. This policy will be updated before that happens.'}</p>
<h2>Analytics</h2><p>${c.analytics ? 'We use privacy-friendly, cookieless analytics to count page views. No personal data is collected.' : 'We do not currently use analytics.'}</p>
<h2>Contact</h2><p>${c.contactEmail ? `Questions? Email <a href="mailto:${c.contactEmail}">${c.contactEmail}</a>.` : 'Questions? Contact details will be added here.'}</p>`,
  nl: (c) => `<p>Berekeningen op deze site gebeuren volledig in je browser; ingevulde waarden worden niet naar onze servers gestuurd of opgeslagen.</p>
<h2>Advertenties</h2><p>${c.adsenseClient ? 'We tonen advertenties via Google AdSense. Google en partners kunnen cookies gebruiken om advertenties te tonen op basis van eerdere bezoeken. Je kunt gepersonaliseerde advertenties uitzetten via <a href="https://adssettings.google.com" rel="nofollow">Google Advertentie-instellingen</a>. In de EU vragen we eerst toestemming.' : 'Deze site kan in de toekomst advertenties tonen. Deze verklaring wordt daarvoor bijgewerkt.'}</p>
<h2>Statistieken</h2><p>${c.analytics ? 'We gebruiken privacyvriendelijke statistieken zonder cookies. Er worden geen persoonsgegevens verzameld.' : 'We gebruiken op dit moment geen statistieken.'}</p>
<h2>Contact</h2><p>${c.contactEmail ? `Vragen? Mail naar <a href="mailto:${c.contactEmail}">${c.contactEmail}</a>.` : 'Contactgegevens volgen.'}</p>`,
};
