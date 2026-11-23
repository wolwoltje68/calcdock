// Every tool = one page per language.
// Language-neutral: id, cat, form(t), init, js.  Per language (text.<lang>): slug, title, desc, h1, intro, l (labels), o (output labels), body, faq, d (defaults).
// Inside js/init: num(id), val(id), setv(id,v), fmt(n,dec), money(n), out(rows, extraHtml), table(head, rows), O = output labels, LOCALE.
// To add a language: add text.<lang> to every tool + an entry in i18n.mjs.

export const tools = [
  {
    id: 'percentage', cat: 'math',
    form: t => `
      <fieldset><legend>${t.l.g1}</legend>
        <label>${t.l.pct}<input id="p1" type="number" step="any" value="15"></label>
        <label>${t.l.of}<input id="g1" type="number" step="any" value="200"></label></fieldset>
      <fieldset><legend>${t.l.g2}</legend>
        <label>${t.l.num}<input id="a2" type="number" step="any" value="30"></label>
        <label>${t.l.of}<input id="b2" type="number" step="any" value="120"></label></fieldset>
      <fieldset><legend>${t.l.g3}</legend>
        <label>${t.l.old}<input id="o3" type="number" step="any" value="80"></label>
        <label>${t.l.new}<input id="n3" type="number" step="any" value="100"></label></fieldset>`,
    js: `
      const r1=num('p1')/100*num('g1'), r2=num('b2')?num('a2')/num('b2')*100:NaN, r3=num('o3')?(num('n3')-num('o3'))/Math.abs(num('o3'))*100:NaN;
      out([[fmt(num('p1'))+'% '+O.of+' '+fmt(num('g1')), fmt(r1)],[fmt(num('a2'))+' '+O.is+' … % '+O.of+' '+fmt(num('b2')), fmt(r2)+'%'],[O.change, (r3>0?'+':'')+fmt(r3)+'%']]);`,
    text: {
      en: {
        slug: 'percentage-calculator', title: 'Percentage Calculator – % of a Number, Increase & Decrease',
        desc: 'Free percentage calculator: what is X% of Y, X is what percent of Y, and percentage increase or decrease. Instant results with formulas.',
        h1: 'Percentage Calculator', intro: 'Three common percentage calculations in one place. Results update as you type.',
        l: { g1: 'What is … % of …?', g2: '… is what percent of …?', g3: 'Percentage change', pct: 'Percentage', of: 'of', num: 'Number', old: 'Old value', new: 'New value' },
        o: { of: 'of', is: 'is', change: 'Change' },
        body: `<h2>Percentage formulas</h2>
          <p><strong>X% of Y:</strong> Y × X / 100. Example: 15% of 200 = 200 × 15 / 100 = 30.</p>
          <p><strong>A is what percent of B:</strong> A / B × 100. Example: 30 out of 120 = 25%.</p>
          <p><strong>Percentage change:</strong> (new − old) / old × 100. From 80 to 100 is a 25% increase. From 100 to 80 is a 20% decrease – not 25%! You always divide by the <em>old</em> value.</p>
          <h2>Percent vs. percentage point</h2>
          <p>If an interest rate rises from 2% to 3%, that is an increase of 1 <em>percentage point</em> but 50 <em>percent</em>.</p>`,
        faq: [['How do I calculate a percentage?', 'Divide the part by the whole and multiply by 100. 30 out of 120 is 30 / 120 × 100 = 25%.'],
          ['How do I calculate percentage increase?', 'Subtract the old value from the new value, divide by the old value and multiply by 100.'],
          ['What is 1 percent of a number?', 'Divide the number by 100. 1% of 250 is 2.5.']],
      },
      nl: {
        slug: 'procent-berekenen', title: 'Procent berekenen – percentage van, toename en afname',
        desc: 'Snel procenten berekenen: hoeveel is X% van Y, hoeveel procent is X van Y en de procentuele stijging of daling.',
        h1: 'Procent berekenen', intro: 'Drie handige procentberekeningen in één. De uitkomst verschijnt direct.',
        l: { g1: 'Hoeveel is … % van …?', g2: '… is hoeveel procent van …?', g3: 'Procentuele verandering', pct: 'Percentage', of: 'van', num: 'Getal', old: 'Oude waarde', new: 'Nieuwe waarde' },
        o: { of: 'van', is: 'is', change: 'Verandering' },
        body: `<h2>Formules voor procenten</h2>
          <p><strong>X% van Y:</strong> Y × X / 100. Voorbeeld: 15% van 200 = 30.</p>
          <p><strong>Hoeveel procent is A van B:</strong> A / B × 100. Voorbeeld: 30 van 120 = 25%.</p>
          <p><strong>Procentuele verandering:</strong> (nieuw − oud) / oud × 100. Van 80 naar 100 is +25%. Van 100 naar 80 is −20%, niet −25%: je deelt altijd door de <em>oude</em> waarde.</p>
          <h2>Procent vs. procentpunt</h2><p>Stijgt de rente van 2% naar 3%, dan is dat 1 <em>procentpunt</em> maar 50 <em>procent</em>.</p>`,
        faq: [['Hoe reken je een percentage uit?', 'Deel het deel door het geheel en vermenigvuldig met 100. 30 van 120 = 25%.'],
          ['Hoe bereken je een procentuele stijging?', 'Trek de oude waarde af van de nieuwe, deel door de oude waarde en vermenigvuldig met 100.']],
      },
    },
  },
  {
    id: 'discount', cat: 'money',
    form: t => `
      <fieldset><legend>${t.l.g1}</legend>
        <label>${t.l.price}<input id="prijs" type="number" step="0.01" value="59.99"></label>
        <label>${t.l.disc}<input id="kort" type="number" step="any" value="25"></label>
        <label>${t.l.disc2}<input id="kort2" type="number" step="any" value="0"></label></fieldset>
      <fieldset><legend>${t.l.g2}</legend>
        <label>${t.l.from}<input id="van" type="number" step="0.01" value="80"></label>
        <label>${t.l.to}<input id="voor" type="number" step="0.01" value="60"></label></fieldset>`,
    js: `
      const p=num('prijs'), na=p*(1-num('kort')/100)*(1-num('kort2')/100), pct=num('van')?(1-num('voor')/num('van'))*100:NaN;
      out([[O.pay, money(na)],[O.save, money(p-na)],[O.total, fmt((1-na/p)*100)+'%'],[money(num('van'))+' → '+money(num('voor')), fmt(pct)+'% '+O.off]]);`,
    text: {
      en: {
        slug: 'discount-calculator', title: 'Discount Calculator – Sale Price, Savings & % Off',
        desc: 'Calculate the sale price after a discount, how much you save, and the percent off. Supports stacked (double) discounts.',
        h1: 'Discount Calculator', intro: 'Find the price after a discount – or work out what percentage off you are really getting.',
        l: { g1: 'Price after discount', g2: 'What percent off?', price: 'Original price', disc: 'Discount (%)', disc2: 'Extra discount (%) – optional', from: 'Was', to: 'Now' },
        o: { pay: 'You pay', save: 'You save', total: 'Total discount', off: 'off' },
        body: `<h2>How to calculate a discount</h2><p>Sale price = price × (1 − discount / 100). 25% off $59.99 is $59.99 × 0.75 = $44.99.</p>
          <h2>Stacked discounts: 20% + 10% is not 30%</h2><p>An extra 10% off an already reduced price gives a total discount of 1 − 0.8 × 0.9 = 28%.</p>
          <h2>Buy one, get one deals</h2><p>Buy one get one half price = 25% off each. Buy one get one free = 50% off. Buy two get one free = 33.3% off.</p>`,
        faq: [['How do I calculate percent off?', 'Divide the new price by the old price, subtract from 1 and multiply by 100. $80 → $60 is 25% off.'],
          ['Is 20% off plus 10% off the same as 30% off?', 'No. The second discount applies to the reduced price, so the total is 28% off.']],
      },
      nl: {
        slug: 'korting-berekenen', title: 'Korting berekenen – prijs na korting en kortingspercentage',
        desc: 'Bereken de prijs na korting, hoeveel je bespaart en welk kortingspercentage je krijgt. Ook voor stapelkorting.',
        h1: 'Korting berekenen', intro: 'Bereken wat je betaalt na korting, of welk percentage korting je eigenlijk krijgt.',
        l: { g1: 'Prijs na korting', g2: 'Welk percentage korting?', price: 'Originele prijs', disc: 'Korting (%)', disc2: 'Extra korting (%) – optioneel', from: 'Van', to: 'Voor' },
        o: { pay: 'Je betaalt', save: 'Je bespaart', total: 'Totale korting', off: 'korting' },
        body: `<h2>Zo bereken je korting</h2><p>Prijs na korting = prijs × (1 − korting / 100). 25% korting op € 59,99 is € 44,99.</p>
          <h2>Stapelkorting: 20% + 10% is geen 30%</h2><p>De tweede korting gaat over de al verlaagde prijs: 1 − 0,8 × 0,9 = 28% totaal.</p>
          <h2>Acties</h2><p>Tweede halve prijs = 25% korting. 1+1 gratis = 50%. 2+1 gratis = 33,3%.</p>`,
        faq: [['Hoeveel korting is tweede halve prijs?', '25% korting als je twee stuks koopt.'],
          ['Hoe reken ik een kortingspercentage uit?', 'Deel de nieuwe prijs door de oude, trek dat af van 1 en vermenigvuldig met 100.']],
      },
    },
  },
  {
    id: 'vat', cat: 'money',
    form: t => `
      <label>${t.l.amount}<input id="bedrag" type="number" inputmode="decimal" step="0.01" value="100"></label>
      <label>${t.l.type}<select id="soort"><option value="ex">${t.l.ex}</option><option value="in">${t.l.inc}</option></select></label>
      <label>${t.l.rate}<input id="tarief" type="number" step="any" value="${t.d.rate}" list="rates"><datalist id="rates">${t.d.rates.map(r => `<option value="${r}">`).join('')}</datalist></label>`,
    js: `
      const b=num('bedrag'), t=num('tarief')/100, ex = val('soort')==='ex' ? b : b/(1+t), inc = ex*(1+t);
      out([[O.ex, money(ex)],[O.tax, money(inc-ex)],[O.inc, money(inc)]]);`,
    text: {
      en: {
        slug: 'vat-calculator', cur: 'GBP', title: 'VAT Calculator – Add or Remove VAT / Sales Tax',
        desc: 'Add or remove VAT or sales tax from any amount. Works with any rate: 20% UK VAT, EU rates or US sales tax.',
        h1: 'VAT & Sales Tax Calculator', intro: 'Enter an amount and the tax rate. Instantly see the net amount, the tax and the gross total.',
        d: { rate: 20, rates: [5, 7, 10, 19, 20, 21, 23, 25] },
        l: { amount: 'Amount', type: 'The amount is', ex: 'excluding tax (net)', inc: 'including tax (gross)', rate: 'Tax rate (%)' },
        o: { ex: 'Net (excl. tax)', tax: 'Tax amount', inc: 'Gross (incl. tax)' },
        body: `<h2>How to add VAT</h2><p>Multiply the net amount by (1 + rate). With 20% VAT: £100 × 1.20 = £120.</p>
          <h2>How to remove VAT</h2><p>Divide the gross amount by (1 + rate): £120 / 1.20 = £100, so the VAT is £20. You <em>cannot</em> simply take 20% off the gross amount – 20% of £120 is £24, which is too much.</p>
          <h2>Common rates</h2><ul><li>UK: 20% standard, 5% reduced</li><li>Germany: 19% / 7%</li><li>France: 20% / 10% / 5.5%</li><li>Netherlands: 21% / 9%</li><li>US sales tax: varies by state and city, typically 0–10%</li></ul>
          <p>Always check current rates with your local tax authority.</p>`,
        faq: [['How do I remove 20% VAT from a price?', 'Divide the price by 1.2. The difference between the two amounts is the VAT.'],
          ['What fraction of a VAT-inclusive price is VAT?', 'For 20% VAT it is 20/120 = 1/6 of the gross price.']],
      },
      nl: {
        slug: 'btw-berekenen', title: 'BTW berekenen – inclusief en exclusief (21% en 9%)',
        desc: 'Bereken direct het btw-bedrag, het bedrag exclusief of inclusief btw. Gratis btw-calculator voor 21%, 9% en 0%.',
        h1: 'BTW berekenen', intro: 'Vul een bedrag in en kies of het inclusief of exclusief btw is. Je ziet direct het btw-bedrag en beide totalen.',
        d: { rate: 21, rates: [0, 9, 21] },
        l: { amount: 'Bedrag', type: 'Het bedrag is', ex: 'exclusief btw', inc: 'inclusief btw', rate: 'Btw-tarief (%)' },
        o: { ex: 'Exclusief btw', tax: 'Btw-bedrag', inc: 'Inclusief btw' },
        body: `<h2>Hoe bereken je btw?</h2><p><strong>Exclusief → inclusief:</strong> × 1,21 (of 1,09). € 100 wordt € 121.</p>
          <p><strong>Inclusief → exclusief:</strong> deel door 1,21 of 1,09. € 121 / 1,21 = € 100; de btw is € 21. Je kunt niet simpelweg 21% van het inclusief-bedrag aftrekken.</p>
          <h2>Btw-tarieven in Nederland</h2><ul><li><strong>21%</strong> – algemeen tarief</li><li><strong>9%</strong> – o.a. voedingsmiddelen, boeken, geneesmiddelen</li><li><strong>0%</strong> – o.a. export</li></ul>
          <p>Controleer bij twijfel de actuele regels bij de Belastingdienst.</p>`,
        faq: [['Hoeveel is 21% btw over 100 euro?', '€ 21; het totaal inclusief btw is € 121.'],
          ['Hoe haal ik de btw van een bedrag af?', 'Deel het bedrag inclusief btw door 1,21 (21%) of 1,09 (9%).']],
      },
    },
  },
  {
    id: 'compound', cat: 'money',
    form: t => `
      <label>${t.l.start}<input id="start" type="number" step="any" value="1000"></label>
      <label>${t.l.monthly}<input id="maand" type="number" step="any" value="100"></label>
      <label>${t.l.rate}<input id="rente" type="number" step="any" value="5"></label>
      <label>${t.l.years}<input id="jaren" type="number" step="1" min="1" max="80" value="20"></label>`,
    js: `
      const r=num('rente')/100/12, n=Math.min(960,Math.round(num('jaren'))*12); let v=num('start'), inleg=v; const rows=[];
      for(let i=1;i<=n;i++){ v=v*(1+r)+num('maand'); inleg+=num('maand'); if(i%12===0) rows.push([i/12, money(inleg), money(v)]); }
      out([[O.end, money(v)],[O.paid, money(inleg)],[O.interest, money(v-inleg)]], table(O.head, rows));`,
    text: {
      en: {
        slug: 'compound-interest-calculator', title: 'Compound Interest Calculator – With Monthly Contributions',
        desc: 'See how your savings or investments grow with compound interest and monthly contributions. Year-by-year table included.',
        h1: 'Compound Interest Calculator', intro: 'See how your money grows thanks to compound interest, with an initial deposit and monthly contributions.',
        l: { start: 'Initial deposit', monthly: 'Monthly contribution', rate: 'Annual interest / return (%)', years: 'Years' },
        o: { end: 'Final balance', paid: 'Total contributions', interest: 'Interest earned', head: ['Year', 'Contributed', 'Balance'] },
        body: `<h2>What is compound interest?</h2><p>With compound interest you earn interest on your interest. Your money grows faster every year – the longer the time horizon, the stronger the effect.</p>
          <h2>The formula</h2><p>A = P × (1 + r)<sup>n</sup>, where P is the principal, r the rate per period and n the number of periods. This calculator compounds monthly (annual rate / 12) and adds contributions at the end of each month.</p>
          <h2>The rule of 72</h2><p>Divide 72 by the interest rate to estimate how many years it takes to double your money. At 6% that is about 12 years.</p>
          <p><em>Investment returns are not guaranteed. This is an illustration, not financial advice.</em></p>`,
        faq: [['How is compound interest calculated?', 'Multiply the principal by (1 + rate) to the power of the number of periods. $1,000 at 5% for 10 years grows to about $1,629.'],
          ['How long does it take to double my money?', 'Use the rule of 72: divide 72 by the annual rate. At 8% it takes about 9 years.']],
      },
      nl: {
        slug: 'rente-op-rente-berekenen', title: 'Rente op rente berekenen – sparen en beleggen calculator',
        desc: 'Bereken hoeveel je spaargeld of belegging groeit met rente op rente, inclusief maandelijkse inleg. Met jaaroverzicht.',
        h1: 'Rente op rente berekenen', intro: 'Zie hoe je vermogen groeit door samengestelde rente, met een eenmalige en maandelijkse inleg.',
        l: { start: 'Startbedrag', monthly: 'Maandelijkse inleg', rate: 'Rente / rendement per jaar (%)', years: 'Looptijd (jaren)' },
        o: { end: 'Eindbedrag', paid: 'Totaal ingelegd', interest: 'Waarvan rente', head: ['Jaar', 'Ingelegd', 'Waarde'] },
        body: `<h2>Wat is rente op rente?</h2><p>Je ontvangt ook rente over eerder ontvangen rente. Daardoor groeit je geld steeds sneller.</p>
          <h2>De formule</h2><p>Eindwaarde = start × (1 + r)<sup>n</sup>. Deze calculator rekent per maand en telt de inleg aan het eind van elke maand op.</p>
          <h2>De regel van 72</h2><p>72 gedeeld door het rentepercentage ≈ aantal jaar tot verdubbeling. Bij 6% is dat 12 jaar.</p>
          <p><em>Rendement is niet gegarandeerd. Dit is een rekenvoorbeeld, geen financieel advies.</em></p>`,
        faq: [['Hoe bereken je rente op rente?', 'Startbedrag × (1 + rente)^jaren. € 1.000 tegen 5% gedurende 10 jaar ≈ € 1.629.']],
      },
    },
  },
  {
    id: 'loan', cat: 'money',
    form: t => `
      <label>${t.l.amount}<input id="bedrag" type="number" step="any" value="15000"></label>
      <label>${t.l.rate}<input id="rente" type="number" step="any" value="7.5"></label>
      <label>${t.l.months}<input id="mnd" type="number" step="1" min="1" value="60"></label>
      <label>${t.l.type}<select id="vorm"><option value="a">${t.l.annuity}</option><option value="l">${t.l.linear}</option></select></label>`,
    js: `
      const P=num('bedrag'), r=num('rente')/100/12, n=Math.round(num('mnd'));
      if(val('vorm')==='a'){ const m = r? P*r/(1-Math.pow(1+r,-n)) : P/n; out([[O.monthly, money(m)],[O.total, money(m*n)],[O.interest, money(m*n-P)]]); }
      else { const af=P/n; let rest=P, tot=0, first=0, last=0; for(let i=0;i<n;i++){ const b=af+rest*r; if(!i) first=b; last=b; tot+=b; rest-=af; }
        out([[O.first, money(first)],[O.last, money(last)],[O.interest, money(tot-P)]]); }`,
    text: {
      en: {
        slug: 'loan-calculator', title: 'Loan Calculator – Monthly Payment & Total Interest',
        desc: 'Calculate the monthly payment and total interest of a loan, car loan or mortgage. Amortizing and fixed-principal repayment.',
        h1: 'Loan Payment Calculator', intro: 'Work out your monthly payment and how much interest you will pay over the life of the loan.',
        l: { amount: 'Loan amount', rate: 'Annual interest rate (%)', months: 'Term (months)', type: 'Repayment type', annuity: 'Fixed payment (amortizing)', linear: 'Fixed principal (declining payment)' },
        o: { monthly: 'Monthly payment', total: 'Total repaid', interest: 'Total interest', first: 'First payment', last: 'Last payment' },
        body: `<h2>How is a loan payment calculated?</h2><p>Most loans (car loans, personal loans, mortgages) use a fixed monthly payment: M = P × r / (1 − (1 + r)<sup>−n</sup>), where P is the loan amount, r the monthly rate (annual rate / 12) and n the number of months.</p>
          <h2>Fixed payment vs. fixed principal</h2><p>With a fixed payment, early payments are mostly interest. With fixed principal you repay the same amount of principal each month, so payments start higher and decline – and you pay less interest overall.</p>
          <h2>Common terms</h2><p>36, 48, 60 or 72 months for car loans; 15 or 30 years (180 / 360 months) for mortgages.</p>
          <p><em>Results are estimates. Lenders may calculate differently (APR, fees, insurance).</em></p>`,
        faq: [['How do I calculate a monthly loan payment?', 'Use the amortization formula M = P·r / (1 − (1+r)^−n), or enter your loan details above.'],
          ['What is the monthly payment on a $20,000 loan at 7% for 5 years?', 'About $396 per month, with roughly $3,760 in total interest.']],
      },
      nl: {
        slug: 'lening-berekenen', title: 'Lening berekenen – maandlasten en totale rente (annuïteit)',
        desc: 'Bereken de maandlasten van een lening of hypotheek met annuïtaire of lineaire aflossing, plus de totale rentekosten.',
        h1: 'Lening berekenen', intro: 'Bereken je maandbedrag en hoeveel rente je in totaal betaalt.',
        l: { amount: 'Leenbedrag', rate: 'Rente per jaar (%)', months: 'Looptijd (maanden)', type: 'Aflosvorm', annuity: 'Annuïtair (vast maandbedrag)', linear: 'Lineair (vaste aflossing)' },
        o: { monthly: 'Maandbedrag', total: 'Totaal terugbetaald', interest: 'Totale rente', first: 'Eerste maandbedrag', last: 'Laatste maandbedrag' },
        body: `<h2>Annuïtair of lineair?</h2><p>Bij <strong>annuïtair</strong> betaal je elke maand hetzelfde. Bij <strong>lineair</strong> los je elke maand een vast bedrag af; je lasten dalen en je betaalt in totaal minder rente.</p>
          <h2>De annuïteitenformule</h2><p>Maandbedrag = P × r / (1 − (1 + r)<sup>−n</sup>).</p><p><em>Let op: geld lenen kost geld. Deze berekening is indicatief.</em></p>`,
        faq: [['Wat is goedkoper: annuïtair of lineair?', 'Lineair, omdat je sneller aflost en minder rente betaalt. De maandlasten zijn in het begin wel hoger.']],
      },
    },
  },
  {
    id: 'salary', cat: 'work',
    form: t => `
      <label>${t.l.know}<select id="soort"><option value="uur">${t.l.hourly}</option><option value="maand">${t.l.monthly}</option><option value="jaar">${t.l.yearly}</option></select></label>
      <label>${t.l.amount}<input id="bedrag" type="number" step="any" value="${t.d.amount}"></label>
      <label>${t.l.hours}<input id="uren" type="number" step="any" value="40"></label>
      <label>${t.l.weeks}<input id="weken" type="number" step="any" value="52"></label>
      <label>${t.l.bonus}<input id="vg" type="number" step="any" value="${t.d.bonus}"></label>`,
    js: `
      const u=num('uren'), w=num('weken')||52, b=num('bedrag'), s=val('soort'); const yrHours=u*w;
      const jaar = s==='uur'? b*yrHours : s==='maand'? b*12 : b; const uur=jaar/yrHours;
      out([[O.hour, money(uur)],[O.day, money(uur*u/5)],[O.week, money(uur*u)],[O.month, money(jaar/12)],[O.year, money(jaar)],[O.yearb, money(jaar*(1+num('vg')/100))]]);`,
    text: {
      en: {
        slug: 'hourly-to-salary-calculator', title: 'Hourly to Salary Calculator – Convert Hourly Wage to Annual Pay',
        desc: 'Convert an hourly wage to annual, monthly, weekly and daily pay – or a salary back to an hourly rate. Adjustable hours and weeks.',
        h1: 'Hourly to Salary Calculator', intro: 'Convert between hourly wage and yearly salary in seconds. All amounts are before tax.',
        d: { amount: 25, bonus: 0 },
        l: { know: 'I know my', hourly: 'hourly wage', monthly: 'monthly salary', yearly: 'annual salary', amount: 'Amount', hours: 'Hours per week', weeks: 'Paid weeks per year', bonus: 'Bonus (% of salary) – optional' },
        o: { hour: 'Hourly', day: 'Daily (5-day week)', week: 'Weekly', month: 'Monthly', year: 'Annual', yearb: 'Annual incl. bonus' },
        body: `<h2>How to convert hourly pay to salary</h2><p>Annual salary = hourly wage × hours per week × 52. A full-time year is 40 × 52 = <strong>2,080 hours</strong>. So $25/hour ≈ $52,000 per year, and $52,000 per year ≈ $25/hour.</p>
          <h2>Quick rule of thumb</h2><p>For a 40-hour week, double the hourly wage and add three zeros: $20/hour ≈ $40,000/year.</p>
          <h2>Unpaid time off</h2><p>If you are not paid for holidays or vacation, lower the number of paid weeks (e.g. 50 instead of 52).</p>
          <p><em>All figures are gross (before taxes and deductions).</em></p>`,
        faq: [['How much is $20 an hour per year?', 'About $41,600 per year at 40 hours per week, 52 weeks.'],
          ['How many work hours are in a year?', 'A full-time year has 2,080 hours (40 hours × 52 weeks).'],
          ['How much is $60,000 a year per hour?', 'About $28.85 per hour based on 2,080 hours.']],
      },
      nl: {
        slug: 'uurloon-berekenen', title: 'Uurloon berekenen – van maandsalaris naar uurloon en terug',
        desc: 'Reken je bruto maandsalaris om naar uurloon, of je uurloon naar maand- en jaarsalaris inclusief 8% vakantiegeld.',
        h1: 'Uurloon berekenen', intro: 'Reken een bruto uurloon om naar maand- en jaarsalaris, of andersom. Inclusief vakantiegeld.',
        d: { amount: 17.5, bonus: 8 },
        l: { know: 'Ik weet mijn', hourly: 'bruto uurloon', monthly: 'bruto maandsalaris', yearly: 'bruto jaarsalaris', amount: 'Bedrag', hours: 'Uren per week', weeks: 'Betaalde weken per jaar', bonus: 'Vakantiegeld (%)' },
        o: { hour: 'Uurloon', day: 'Dagloon (5-daagse week)', week: 'Weekloon', month: 'Maandsalaris', year: 'Jaarsalaris', yearb: 'Jaar incl. vakantiegeld' },
        body: `<h2>Maandsalaris naar uurloon</h2><p>Een maand heeft gemiddeld 52 / 12 ≈ 4,33 weken. Uurloon = maandsalaris / (uren per week × 4,33). € 3.000 bij 40 uur ≈ € 17,31 per uur.</p>
          <p>Sommige cao's rekenen met een andere deler; de uitkomst kan iets afwijken.</p>
          <h2>Vakantiegeld</h2><p>In Nederland heb je recht op minimaal 8% vakantiegeld over je brutoloon.</p><p><em>Dit zijn brutobedragen.</em></p>`,
        faq: [['Hoeveel uur werk je per maand bij 40 uur per week?', 'Gemiddeld 40 × 52 / 12 ≈ 173,3 uur.'], ['En bij 36 uur per week?', '36 × 52 / 12 = 156 uur per maand.']],
      },
    },
  },
  {
    id: 'dates', cat: 'time',
    form: t => `
      <fieldset><legend>${t.l.g1}</legend>
        <label>${t.l.from}<input id="d1" type="date"></label><label>${t.l.to}<input id="d2" type="date"></label></fieldset>
      <fieldset><legend>${t.l.g2}</legend>
        <label>${t.l.start}<input id="d3" type="date"></label><label>${t.l.days}<input id="n" type="number" step="1" value="90"></label></fieldset>`,
    init: `const t=new Date(), iso=d=>d.toISOString().slice(0,10); setv('d1',iso(t)); setv('d3',iso(t)); const x=new Date(t.getFullYear(),11,25,12); if(x<t) x.setFullYear(x.getFullYear()+1); setv('d2',iso(x));`,
    js: `
      const p=s=>{const [y,m,d]=s.split('-').map(Number); return new Date(Date.UTC(y,m-1,d));}; const rows=[];
      if(val('d1')&&val('d2')){ let A=p(val('d1')), B=p(val('d2')); const days=Math.round((B-A)/864e5), s=days<0?-1:1; if(s<0)[A,B]=[B,A];
        let wd=0; for(let d=new Date(A); d<B; d.setUTCDate(d.getUTCDate()+1)){ const w=d.getUTCDay(); if(w&&w<6) wd++; }
        rows.push([O.days, fmt(days,0)],[O.weeks, fmt(days/7)],[O.wd, fmt(s*wd,0)]); }
      if(val('d3')){ const D=p(val('d3')); D.setUTCDate(D.getUTCDate()+Math.round(num('n')));
        rows.push([O.after.replace('#',fmt(num('n'),0)), D.toLocaleDateString(LOCALE,{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})]); }
      out(rows);`,
    text: {
      en: {
        slug: 'days-between-dates', title: 'Days Between Dates Calculator – Days, Weeks & Business Days',
        desc: 'Count the days, weeks and business days between two dates, or add/subtract days from a date. Fast and free date calculator.',
        h1: 'Days Between Dates', intro: 'How many days until your vacation, deadline or birthday? Or what date is it 90 days from now?',
        l: { g1: 'Days between two dates', g2: 'Add or subtract days', from: 'Start date', to: 'End date', start: 'Date', days: 'Days to add (negative = subtract)' },
        o: { days: 'Days', weeks: 'Weeks', wd: 'Business days (Mon–Fri, excl. holidays)', after: 'Date after # days' },
        body: `<h2>How the calculation works</h2><p>The calculator counts calendar days between the two dates: the start date is not included, the end date is. From January 1 to January 2 is therefore 1 day.</p>
          <p>Business days are Monday to Friday. Public holidays are not subtracted, because they differ by country and region.</p>
          <h2>Useful for</h2><ul><li>Counting down to a holiday, birthday or Christmas</li><li>Notice periods, deadlines and contract terms</li><li>Pregnancy, probation periods and warranties</li></ul>`,
        faq: [['How many days are in a year?', '365 in a normal year and 366 in a leap year. 2028 is the next leap year.'],
          ['How many business days are in a year?', 'About 260 (52 weeks × 5 days), minus public holidays that fall on weekdays.']],
      },
      nl: {
        slug: 'dagen-tussen-datums', title: 'Dagen tussen twee datums berekenen – ook werkdagen en weken',
        desc: 'Bereken hoeveel dagen, weken en werkdagen er tussen twee datums zitten. Of tel dagen op bij een datum.',
        h1: 'Dagen tussen twee datums', intro: 'Hoeveel dagen is het nog tot je vakantie, deadline of verjaardag? Of welke datum is het over 90 dagen?',
        l: { g1: 'Verschil tussen datums', g2: 'Datum + aantal dagen', from: 'Van', to: 'Tot', start: 'Startdatum', days: 'Aantal dagen (negatief = terug)' },
        o: { days: 'Aantal dagen', weeks: 'Weken', wd: 'Werkdagen (ma–vr, excl. feestdagen)', after: 'Datum na # dagen' },
        body: `<h2>Hoe werkt deze datumcalculator?</h2><p>De startdatum telt niet mee, de einddatum wel. Van 1 januari tot 2 januari is 1 dag. Werkdagen zijn maandag t/m vrijdag; feestdagen worden niet afgetrokken.</p>`,
        faq: [['Hoeveel werkdagen heeft een jaar?', 'Ongeveer 260, minus feestdagen op doordeweekse dagen.']],
      },
    },
  },
  {
    id: 'age', cat: 'time',
    form: t => `<label>${t.l.birth}<input id="geb" type="date" value="1990-06-15"></label><label>${t.l.on}<input id="op" type="date"></label>`,
    init: `setv('op', new Date().toISOString().slice(0,10));`,
    js: `
      const p=s=>{const [y,m,d]=s.split('-').map(Number); return {y,m,d,t:Date.UTC(y,m-1,d)};};
      if(!val('geb')||!val('op')) return out([]); const g=p(val('geb')), o=p(val('op'));
      let j=o.y-g.y, m=o.m-g.m, d=o.d-g.d; if(d<0){ m--; d+=new Date(Date.UTC(o.y,o.m-1,0)).getUTCDate(); } if(m<0){ j--; m+=12; }
      let nv=Date.UTC(o.y,g.m-1,g.d); if(nv<o.t) nv=Date.UTC(o.y+1,g.m-1,g.d); const tot=Math.round((nv-o.t)/864e5), days=(o.t-g.t)/864e5;
      out([[O.age, O.fmt.replace('#y',j).replace('#m',m).replace('#d',d)],[O.days, fmt(days,0)],[O.weeks, fmt(days/7,0)],[O.next, tot===0?O.today:O.inn.replace('#',tot)]]);`,
    text: {
      en: {
        slug: 'age-calculator', title: 'Age Calculator – How Old Am I Exactly?',
        desc: 'Calculate your exact age in years, months and days, your age in days and weeks, and the days until your next birthday.',
        h1: 'Age Calculator', intro: 'Enter your date of birth to see exactly how old you are – and how many days until your next birthday.',
        l: { birth: 'Date of birth', on: 'Age on date' },
        o: { age: 'Age', fmt: '#y years, #m months, #d days', days: 'In days', weeks: 'In weeks', next: 'Next birthday', today: 'Today! Happy birthday 🎉', inn: 'in # days' },
        body: `<h2>How is age calculated?</h2><p>Subtract your birth year from the current year. If you have not had your birthday yet this year, subtract one more. For the exact age, count the months and days since your last birthday.</p>
          <h2>Born on February 29?</h2><p>Leap-day babies usually celebrate on February 28 or March 1 in non-leap years. Legally, most countries treat March 1 as the birthday in common years.</p>`,
        faq: [['How many days old am I?', 'Enter your date of birth above – the calculator shows your age in days and weeks.']],
      },
      nl: {
        slug: 'leeftijd-berekenen', title: 'Leeftijd berekenen – hoe oud ben ik precies?',
        desc: 'Bereken je exacte leeftijd in jaren, maanden en dagen, je leeftijd in dagen en hoe lang het nog duurt tot je verjaardag.',
        h1: 'Leeftijd berekenen', intro: 'Vul je geboortedatum in en zie precies hoe oud je bent – en hoeveel dagen tot je volgende verjaardag.',
        l: { birth: 'Geboortedatum', on: 'Op datum' },
        o: { age: 'Leeftijd', fmt: '#y jaar, #m maanden, #d dagen', days: 'In dagen', weeks: 'In weken', next: 'Volgende verjaardag', today: 'Vandaag! Gefeliciteerd 🎉', inn: 'over # dagen' },
        body: `<h2>Hoe bereken je je leeftijd?</h2><p>Trek je geboortejaar af van het huidige jaar; ben je dit jaar nog niet jarig geweest, trek er dan 1 vanaf.</p>
          <h2>Jarig op 29 februari?</h2><p>Juridisch word je in Nederland in gewone jaren een jaar ouder op 1 maart.</p>`,
        faq: [['Hoeveel dagen oud ben ik?', 'Vul hierboven je geboortedatum in.']],
      },
    },
  },
  {
    id: 'bmi', cat: 'health',
    form: t => `
      <label>${t.l.unit}<select id="unit"><option value="${t.d.unit}">${t.d.unit === 'm' ? t.l.metric : t.l.imperial}</option><option value="${t.d.unit === 'm' ? 'i' : 'm'}">${t.d.unit === 'm' ? t.l.imperial : t.l.metric}</option></select></label>
      <div data-u="m"><label>${t.l.cm}<input id="len" type="number" step="any" value="178"></label><label>${t.l.kg}<input id="kg" type="number" step="any" value="75"></label></div>
      <div data-u="i"><label>${t.l.ft}<input id="ft" type="number" step="1" value="5"></label><label>${t.l.inch}<input id="inch" type="number" step="any" value="10"></label><label>${t.l.lb}<input id="lb" type="number" step="any" value="165"></label></div>`,
    js: `
      const u=val('unit'); document.querySelectorAll('[data-u]').forEach(e=>e.hidden=e.dataset.u!==u);
      const m = u==='m'? num('len')/100 : (num('ft')*12+num('inch'))*0.0254, kg = u==='m'? num('kg') : num('lb')*0.45359237, bmi=kg/(m*m);
      const cat = bmi<18.5?O.c1:bmi<25?O.c2:bmi<30?O.c3:O.c4, lo=18.5*m*m, hi=24.9*m*m;
      out([[O.bmi, fmt(bmi,1)],[O.cat, cat],[O.range, u==='m'? fmt(lo,1)+' – '+fmt(hi,1)+' kg' : fmt(lo/0.45359237,0)+' – '+fmt(hi/0.45359237,0)+' lb']]);`,
    text: {
      en: {
        slug: 'bmi-calculator', title: 'BMI Calculator – Metric & Imperial (lb, ft/in)',
        desc: 'Calculate your Body Mass Index in pounds and feet or kg and cm. See your BMI category and the healthy weight range for your height.',
        h1: 'BMI Calculator', intro: 'Enter your height and weight to see your BMI, your category and the healthy weight range for your height.',
        d: { unit: 'i' },
        l: { unit: 'Units', metric: 'Metric (cm, kg)', imperial: 'Imperial (ft, in, lb)', cm: 'Height (cm)', kg: 'Weight (kg)', ft: 'Height (ft)', inch: 'Height (in)', lb: 'Weight (lb)' },
        o: { bmi: 'Your BMI', cat: 'Category', range: 'Healthy weight for your height', c1: 'Underweight', c2: 'Healthy weight', c3: 'Overweight', c4: 'Obese' },
        body: `<h2>How is BMI calculated?</h2><p>BMI = weight (kg) / height (m)². In imperial units: BMI = 703 × weight (lb) / height (in)². Someone who is 5'10" and 165 lb has a BMI of about 23.7.</p>
          <h2>BMI categories for adults</h2><ul><li>Below 18.5: underweight</li><li>18.5 – 24.9: healthy weight</li><li>25 – 29.9: overweight</li><li>30 or higher: obese</li></ul>
          <h2>Limitations</h2><p>BMI does not account for muscle mass, body shape, age or ethnicity. Different guidelines apply to children, athletes and pregnant women. Talk to a doctor if you have concerns about your weight.</p>`,
        faq: [['What is a healthy BMI?', 'For adults, a BMI between 18.5 and 24.9 is considered healthy.'], ['Is BMI accurate?', 'It is a rough screening tool. Muscular people can have a high BMI without excess fat; waist circumference is a useful addition.']],
      },
      nl: {
        slug: 'bmi-berekenen', title: 'BMI berekenen – wat is mijn gezonde gewicht?',
        desc: 'Bereken je Body Mass Index (BMI) met lengte en gewicht en zie of je een gezond gewicht hebt.',
        h1: 'BMI berekenen', intro: 'Vul je lengte en gewicht in. Je ziet je BMI, de categorie en welk gewicht bij jouw lengte gezond is.',
        d: { unit: 'm' },
        l: { unit: 'Eenheden', metric: 'Metrisch (cm, kg)', imperial: 'Engels (ft, in, lb)', cm: 'Lengte (cm)', kg: 'Gewicht (kg)', ft: 'Lengte (ft)', inch: 'Lengte (in)', lb: 'Gewicht (lb)' },
        o: { bmi: 'Jouw BMI', cat: 'Categorie', range: 'Gezond gewicht bij jouw lengte', c1: 'Ondergewicht', c2: 'Gezond gewicht', c3: 'Overgewicht', c4: 'Ernstig overgewicht' },
        body: `<h2>Hoe wordt BMI berekend?</h2><p>BMI = gewicht (kg) / lengte (m)². 1,78 m en 75 kg geeft een BMI van ≈ 23,7.</p>
          <h2>Categorieën</h2><ul><li>&lt; 18,5: ondergewicht</li><li>18,5 – 24,9: gezond</li><li>25 – 29,9: overgewicht</li><li>≥ 30: ernstig overgewicht</li></ul>
          <p>BMI houdt geen rekening met spiermassa of leeftijd. Overleg bij twijfel met je huisarts.</p>`,
        faq: [['Wat is een gezond BMI?', 'Voor volwassenen tussen 18,5 en 25.']],
      },
    },
  },
  {
    id: 'grade', cat: 'school',
    form: t => `
      <label>${t.l.grades} <small>${t.l.hint}</small><textarea id="cijfers" rows="5">${t.d.grades}</textarea></label>
      <label>${t.l.goal}<input id="doel" type="number" step="any" value="${t.d.goal}"></label>
      <label>${t.l.nextw}<input id="wv" type="number" step="any" value="${t.d.nextw}"></label>`,
    js: `
      let s=0, w=0; val('cijfers').split(/\\n/).forEach(l=>{ l=l.trim(); if(!l) return; const p=l.replace(/,/g,'.').split(/[\\s;x×]+/).map(Number); if(isNaN(p[0])) return; const ww=isNaN(p[1])?1:p[1]; s+=p[0]*ww; w+=ww; });
      if(!w) return out([]); const need=(num('doel')*(w+num('wv'))-s)/num('wv');
      out([[O.avg, fmt(s/w,2)],[O.weight, fmt(w)],[O.need, need<=0?O.safe:fmt(need,1)]]);`,
    text: {
      en: {
        slug: 'weighted-average-grade-calculator', title: 'Weighted Grade Calculator – Average & Grade Needed',
        desc: 'Calculate your weighted average grade and the score you need on your next test or final exam to reach your target.',
        h1: 'Weighted Grade Calculator', intro: 'Enter your scores and their weights to get your weighted average – and the score you need next to hit your goal.',
        d: { grades: '85 20\n72 30\n90 10', goal: 80, nextw: 40 },
        l: { grades: 'Scores with weight', hint: 'one per line: score weight (e.g. "85 20")', goal: 'Target average', nextw: 'Weight of next test / final' },
        o: { avg: 'Weighted average', weight: 'Total weight', need: 'Score needed on next test', safe: 'Already reached 👍' },
        body: `<h2>How to calculate a weighted average</h2><p>Multiply each score by its weight, add everything up and divide by the total weight. Example: 85 (20%), 72 (30%) and 90 (10%) gives (1700 + 2160 + 900) / 60 = 79.3.</p>
          <h2>What do I need on my final?</h2><p>Needed = (target × (current weight + final weight) − current points) / final weight. Enter your current scores above and set the weight of your final exam to see the score you need.</p>
          <p>Works for percentages (0–100), letter-grade points (GPA 0–4) or any other scale.</p>`,
        faq: [['How do I calculate my grade with weights?', 'Multiply each grade by its weight, sum them, and divide by the sum of the weights.'], ['What grade do I need on my final?', 'Enter your current grades, your target average and the weight of the final; the calculator shows the score you need.']],
      },
      nl: {
        slug: 'gemiddelde-cijfer-berekenen', title: 'Gemiddeld cijfer berekenen – met weging',
        desc: 'Bereken je gewogen gemiddelde cijfer en welk cijfer je nog moet halen voor een voldoende.',
        h1: 'Gemiddeld cijfer berekenen', intro: 'Vul je cijfers en de weging in. Zie je gemiddelde en welk cijfer je nog nodig hebt.',
        d: { grades: '6,5 1\n7,8 2\n5,4 1', goal: 7, nextw: 2 },
        l: { grades: 'Cijfers met weging', hint: 'één per regel: cijfer weging (bijv. "6,5 2")', goal: 'Gewenst gemiddelde', nextw: 'Weging volgende toets' },
        o: { avg: 'Gemiddelde', weight: 'Totale weging', need: 'Nodig bij volgende toets', safe: 'Al gehaald 👍' },
        body: `<h2>Gewogen gemiddelde</h2><p>Vermenigvuldig elk cijfer met zijn weging, tel op en deel door de totale weging. 6,5 (×1), 7,8 (×2), 5,4 (×1) = 27,5 / 4 = 6,88.</p>
          <h2>Afronden</h2><p>Veel scholen ronden 5,45 af naar 5,5 – kijk in je PTA of examenreglement.</p>`,
        faq: [['Wat moet ik halen voor een voldoende?', 'Vul je cijfers in, kies 5,5 als doel en de weging van je volgende toets.']],
      },
    },
  },
];
