/**
 * ✉️ A11 (R283, Experten-Audit ← N17): praktische Schreibgenres jenseits der
 * Pruefung — förmliche E-Mail, Beschwerde, Reklamation, Entschuldigung u. a.
 * Jedes Item: Situation (AR), Aufgabe (DE), Redemittel-Bausteine, Mustertext
 * (erst nach eigenem Versuch sichtbar) und Selbstkontroll-Checkliste.
 * Bewertung ehrlich: Selbstkontrolle gegen Checkliste — kein erfundenes Urteil.
 */
export interface SchreibAlltagItem {
  id: string;
  genreDe: string;
  genreAr: string;
  stufe: "A2" | "B1" | "B2";
  situationAr: string;
  aufgabeDe: string;
  bausteine: string[];
  muster: string;
  checkliste: string[];
}

export const SCHREIB_ALLTAG: SchreibAlltagItem[] = [
  {
    id: "sa-01", genreDe: "Anfrage (förmliche E-Mail)", genreAr: "طلب معلومات — إيميل رسمي", stufe: "A2",
    situationAr: "تريد الالتحاق بدورة ألمانية مسائية في مدرسة اللغات وتسأل عن المواعيد والرسوم وإمكانية التقسيط.",
    aufgabeDe: "Schreiben Sie eine E-Mail an die Volkshochschule: Fragen Sie nach Kurszeiten, Preis und Ratenzahlung. Bitten Sie um eine Antwort bis Freitag.",
    bausteine: ["Betreff: Anfrage zum Abendkurs", "Sehr geehrte Damen und Herren,", "ich interessiere mich für …", "Könnten Sie mir bitte mitteilen, …?", "Über eine Antwort bis Freitag würde ich mich sehr freuen.", "Mit freundlichen Grüßen"],
    muster: "Betreff: Anfrage zum Deutsch-Abendkurs\n\nSehr geehrte Damen und Herren,\n\nich interessiere mich für Ihren Deutsch-Abendkurs ab September. Könnten Sie mir bitte mitteilen, an welchen Tagen der Kurs stattfindet und was er kostet? Ist auch eine Zahlung in zwei Raten möglich?\n\nÜber eine Antwort bis Freitag würde ich mich sehr freuen.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["سطر موضوع (Betreff) واضح؟", "تحية رسمية وختام رسمي؟", "ثلاثة أسئلة محددة على الأقل؟", "طلب ردّ بمهلة مهذّبة؟"],
  },
  {
    id: "sa-02", genreDe: "Beschwerde an die Hausverwaltung", genreAr: "شكوى لإدارة السكن", stufe: "B1",
    situationAr: "التدفئة في شقتك معطّلة منذ ثلاثة أيام في الشتاء، واتصلت مرتين دون نتيجة. اكتب شكوى حازمة مهذّبة بمهلة.",
    aufgabeDe: "Schreiben Sie an die Hausverwaltung: Beschreiben Sie das Problem (Heizung defekt, seit drei Tagen), erwähnen Sie Ihre zwei Anrufe und setzen Sie eine Frist bis Donnerstag.",
    bausteine: ["Betreff: Defekte Heizung in Wohnung 12", "seit drei Tagen funktioniert … nicht", "ich habe bereits zweimal angerufen", "leider ohne Erfolg", "ich bitte Sie, das Problem bis Donnerstag zu beheben", "andernfalls müsste ich die Miete mindern"],
    muster: "Betreff: Defekte Heizung in Wohnung 12 — Bitte um Reparatur\n\nSehr geehrte Damen und Herren,\n\nseit drei Tagen funktioniert die Heizung in meiner Wohnung nicht. Ich habe bereits zweimal bei Ihnen angerufen, leider ohne Erfolg. In der Wohnung sind nur 14 Grad.\n\nIch bitte Sie, das Problem bis Donnerstag zu beheben. Andernfalls müsste ich leider die Miete mindern.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["وصفت المشكلة بزمن واضح (seit)؟", "ذكرت محاولاتك السابقة؟", "مهلة محددة وحازمة بلا إهانة؟", "ألمحت لعاقبة قانونية بهدوء؟"],
  },
  {
    id: "sa-03", genreDe: "Reklamation (Online-Kauf)", genreAr: "مرتجع/استبدال شراء إلكتروني", stufe: "B1",
    situationAr: "طلبت حذاء مقاس 43 فوصل 41. اكتب للمتجر طالبًا الاستبدال وإرفاق معلومات الطلب.",
    aufgabeDe: "Schreiben Sie an den Onlineshop: Bestellnummer nennen, falsche Größe beschreiben, Umtausch in Größe 43 verlangen, Rücksendeetikett erbitten.",
    bausteine: ["Betreff: Reklamation zu Bestellung Nr. …", "leider ist ein Fehler passiert", "die gelieferte Größe ist 41 statt 43", "ich bitte um einen Umtausch", "könnten Sie mir ein Rücksendeetikett schicken?"],
    muster: "Betreff: Reklamation zu Bestellung Nr. 4581\n\nSehr geehrte Damen und Herren,\n\nleider ist bei meiner Bestellung ein Fehler passiert: Die gelieferten Schuhe haben Größe 41, bestellt hatte ich Größe 43. Ich bitte um einen Umtausch in Größe 43.\n\nKönnten Sie mir für die Rücksendung ein Etikett schicken? Vielen Dank im Voraus.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["رقم الطلب في الموضوع؟", "المشكلة بجملة واحدة دقيقة؟", "طلبك الصريح (استبدال + ملصق إرجاع)؟", "نبرة حازمة ومهذّبة؟"],
  },
  {
    id: "sa-04", genreDe: "Entschuldigung an den Arbeitgeber", genreAr: "اعتذار لصاحب العمل", stufe: "A2",
    situationAr: "ابنك مريض ولن تستطيع الحضور غدًا. اكتب اعتذارًا قصيرًا لمديرك مع اقتراح تعويض الوردية.",
    aufgabeDe: "Schreiben Sie an Ihren Chef: Entschuldigen Sie sich für morgen (krankes Kind), nennen Sie die betroffene Schicht und bieten Sie einen Tausch am Samstag an.",
    bausteine: ["Sehr geehrter Herr Yilmaz,", "es tut mir sehr leid, aber …", "mein Sohn ist krank", "ich kann morgen nicht zur Arbeit kommen", "gerne übernehme ich dafür die Schicht am Samstag"],
    muster: "Sehr geehrter Herr Yilmaz,\n\nes tut mir sehr leid, aber mein Sohn ist krank und ich kann morgen nicht zur Arbeit kommen. Gerne übernehme ich dafür die Schicht am Samstag.\n\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["اعتذار صريح في أول جملة؟", "السبب باختصار وبلا تفاصيل زائدة؟", "يوم/وردية محددة؟", "عرض حلّ بدلًا من المشكلة فقط؟"],
  },
  {
    id: "sa-05", genreDe: "Termin verschieben (Arzt)", genreAr: "تأجيل موعد طبيب", stufe: "A2",
    situationAr: "لديك موعد أسنان الثلاثاء 10:00 لكنك تعمل. اكتب للعيادة طالبًا موعدًا بعد 16:00.",
    aufgabeDe: "Schreiben Sie an die Zahnarztpraxis: Nennen Sie Ihren Termin am Dienstag um 10 Uhr, erklären Sie kurz den Grund und bitten Sie um einen Termin nach 16 Uhr.",
    bausteine: ["Betreff: Terminverschiebung", "ich habe am Dienstag um 10 Uhr einen Termin", "leider arbeite ich zu dieser Zeit", "wäre ein Termin nach 16 Uhr möglich?", "ich danke Ihnen für Ihr Verständnis"],
    muster: "Betreff: Terminverschiebung am Dienstag\n\nSehr geehrte Damen und Herren,\n\nich habe am Dienstag um 10 Uhr einen Termin bei Frau Dr. Sommer. Leider arbeite ich zu dieser Zeit. Wäre ein Termin nach 16 Uhr möglich?\n\nIch danke Ihnen für Ihr Verständnis.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["موعدك الأصلي مذكور بدقة؟", "سبب التأجيل بجملة؟", "اقتراح زمن بديل واضح؟", "شكر مهذّب في الختام؟"],
  },
  {
    id: "sa-06", genreDe: "Krankmeldung (Arbeit)", genreAr: "إبلاغ مرض للعمل", stufe: "A2",
    situationAr: "استيقظت بحمّى. اكتب إبلاغ مرض قصيرًا: اليوم، والمدة المتوقعة، وشهادة الطبيب.",
    aufgabeDe: "Schreiben Sie eine kurze Krankmeldung an Ihre Firma: Fieber seit heute, Arztbesuch heute, Krankschreibung folgt per Post/Mail.",
    bausteine: ["Betreff: Krankmeldung", "ich melde mich für heute krank", "ich habe Fieber und gehe heute zum Arzt", "die Krankschreibung schicke ich Ihnen zu", "ich melde mich morgen erneut"],
    muster: "Betreff: Krankmeldung\n\nGuten Morgen Frau Berger,\n\nich melde mich für heute krank. Ich habe Fieber und gehe heute Vormittag zum Arzt. Die Krankschreibung schicke ich Ihnen sofort zu. Morgen melde ich mich erneut.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["أبلغت قبل بدء الوردية؟", "المدة المتوقعة مذكورة؟", "وعد بإرسال الشهادة؟", "قصير وواضح بلا تفاصيل طبية؟"],
  },
  {
    id: "sa-07", genreDe: "Nachfrage beim Bürgerbüro", genreAr: "استفسار عند مكتب المواطنين", stufe: "B1",
    situationAr: "قدّمت طلب إقامة قبل ستة أسابيع بلا ردّ. اكتب استفسارًا رسميًا عن حالة الطلب برقم الملف.",
    aufgabeDe: "Schreiben Sie ans Bürgerbüro: Antrag vor sechs Wochen gestellt, Aktenzeichen nennen, höflich nach dem Stand fragen und um schriftliche Antwort bitten.",
    bausteine: ["Betreff: Nachfrage zu meinem Antrag, Az. …", "vor sechs Wochen habe ich einen Antrag gestellt", "bis heute habe ich keine Antwort erhalten", "ich bitte Sie um eine kurze Rückmeldung zum aktuellen Stand", "für eine baldige Antwort wäre ich Ihnen sehr dankbar"],
    muster: "Betreff: Nachfrage zu meinem Antrag, Az. 77-2210\n\nSehr geehrte Damen und Herren,\n\nvor sechs Wochen habe ich einen Antrag auf Verlängerung meiner Aufenthaltserlaubnis gestellt (Aktenzeichen 77-2210). Bis heute habe ich keine Antwort erhalten.\n\nIch bitte Sie um eine kurze Rückmeldung zum aktuellen Stand. Vielen Dank.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["رقم الملف في الموضوع؟", "المدة المنقضية مذكورة؟", "طلب ردّ مكتوب صريح؟", "لا اتهام — استفسار وقائعي؟"],
  },
  {
    id: "sa-08", genreDe: "Einladung höflich absagen", genreAr: "اعتذار عن دعوة", stufe: "A2",
    situationAr: "زميلتك تدعوك لعيد ميلادها السبت، ولديك وردية عمل. اعتذر واقترح لقاءً آخر.",
    aufgabeDe: "Sagen Sie die Einladung zum Geburtstag am Samstag höflich ab (Arbeitsschicht) und schlagen Sie ein Treffen nächste Woche vor.",
    bausteine: ["Liebe Sabine,", "vielen Dank für die Einladung!", "leider muss ich am Samstag arbeiten", "das tut mir wirklich leid", "wie wäre es mit einem Kaffee nächste Woche?"],
    muster: "Liebe Sabine,\n\nvielen Dank für die Einladung zu deinem Geburtstag! Leider muss ich am Samstag arbeiten, das tut mir wirklich leid.\n\nWie wäre es mit einem Kaffee nächste Woche? Ich lade dich ein!\n\nHerzliche Grüße\nKarim Ben Ali",
    checkliste: ["شكر على الدعوة أولًا؟", "سبب الاعتذار واضح؟", "أسف صادق بلا مبالغة؟", "اقتراح بديل محدد؟"],
  },
  {
    id: "sa-09", genreDe: "Widerspruch (kurz, sachlich)", genreAr: "اعتراض رسمي قصير", stufe: "B2",
    situationAr: "وصلك قرار رسوم غير صحيح (ازدواج احتساب). اكتب اعتراضًا واقعيًا بمهلة واطلب التصحيح.",
    aufgabeDe: "Legen Sie Widerspruch gegen einen Gebührenbescheid ein: Doppelberechnung sachlich darlegen, Belege erwähnen, Korrektur und neuen Bescheid verlangen.",
    bausteine: ["Betreff: Widerspruch gegen den Bescheid vom …", "hiermit lege ich Widerspruch ein", "die Gebühr wurde doppelt berechnet", "die Zahlungsbelege liegen bei", "ich bitte um Korrektur und einen neuen Bescheid"],
    muster: "Betreff: Widerspruch gegen den Gebührenbescheid vom 3. Mai\n\nSehr geehrte Damen und Herren,\n\nhiermit lege ich Widerspruch gegen Ihren Bescheid vom 3. Mai ein. Die Gebühr von 84 Euro wurde doppelt berechnet; beide Zahlungsbelege liegen diesem Schreiben bei.\n\nIch bitte um Korrektur und Zusendung eines neuen Bescheids.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["كلمة Widerspruch في الموضوع والمتن؟", "الحقائق بالأرقام والتواريخ؟", "المرفقات مذكورة؟", "مطلب التصحيح صريح وبلا انفعال؟"],
  },
  {
    id: "sa-10", genreDe: "Anmeldung: Kind in der Kita", genreAr: "تسجيل طفل في حضانة", stufe: "B1",
    situationAr: "انتقلت لحيّ جديد. اكتب لحضانة الحيّ تسأل عن مكان لابنتك (4 سنوات) من سبتمبر.",
    aufgabeDe: "Schreiben Sie an die Kita: Umzug in den Stadtteil, Tochter (4 Jahre), Platz ab September gesucht, Besichtigungstermin vorschlagen.",
    bausteine: ["Betreff: Anmeldung für einen Kitaplatz", "wir sind neu in den Stadtteil gezogen", "unsere Tochter ist vier Jahre alt", "gibt es ab September einen freien Platz?", "gerne kommen wir zu einer Besichtigung vorbei"],
    muster: "Betreff: Anmeldung für einen Kitaplatz ab September\n\nSehr geehrte Damen und Herren,\n\nwir sind neu in den Stadtteil gezogen und suchen ab September einen Kitaplatz für unsere Tochter (4 Jahre). Gibt es bei Ihnen noch einen freien Platz?\n\nGerne kommen wir vorher zu einer Besichtigung vorbei.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["عمر الطفل والتاريخ مذكوران؟", "سبب الانتقال باختصار؟", "سؤال مباشر عن المكان الشاغر؟", "عرض زيارة تعريفية؟"],
  },
  {
    id: "sa-11", genreDe: "Bitte um Auskunft (Vermieter)", genreAr: "طلب توضيح من المؤجّر", stufe: "B1",
    situationAr: "فاتورة تكاليف إضافية (Nebenkosten) ارتفعت 120 يورو دون تفسير. اطلب كشفًا مفصّلًا.",
    aufgabeDe: "Schreiben Sie an Ihren Vermieter: Nebenkosten um 120 Euro gestiegen, um eine aufgeschlüsselte Abrechnung und Erklärung der größten Posten bitten.",
    bausteine: ["Betreff: Nebenkostenabrechnung 2025", "die Kosten sind um 120 Euro gestiegen", "ich bitte um eine aufgeschlüsselte Abrechnung", "besonders die Posten Heizung und Wasser sind mir unklar", "vielen Dank für Ihre Mühe"],
    muster: "Betreff: Nebenkostenabrechnung — Bitte um Aufschlüsselung\n\nSehr geehrter Herr Klein,\n\nin der neuen Abrechnung sind die Kosten um 120 Euro gestiegen. Besonders die Posten Heizung und Wasser sind mir unklar.\n\nIch bitte um eine aufgeschlüsselte Abrechnung. Vielen Dank für Ihre Mühe.\n\nMit freundlichen Grüßen\nKarim Ben Ali",
    checkliste: ["المبلغ والتغيّر محددان؟", "طلب كشف مفصّل صريح؟", "البنود الغامضة مسمّاة؟", "نبرة استيضاح لا اتهام؟"],
  },
  {
    id: "sa-12", genreDe: "Dankschreiben nach Hilfe", genreAr: "رسالة شكر بعد مساعدة", stufe: "A2",
    situationAr: "جارتك اعتنت بقطّتك أثناء سفرك. اكتب شكرًا قصيرًا دافئًا مع دعوة صغيرة.",
    aufgabeDe: "Bedanken Sie sich bei Ihrer Nachbarin für die Betreuung Ihrer Katze und laden Sie sie als Dank zum Tee ein.",
    bausteine: ["Liebe Frau Wagner,", "herzlichen Dank für Ihre Hilfe!", "die Katze war bei Ihnen sehr glücklich", "als kleines Dankeschön lade ich Sie zum Tee ein", "passen Ihnen der Freitag?"],
    muster: "Liebe Frau Wagner,\n\nherzlichen Dank für Ihre Hilfe! Die Katze war bei Ihnen sehr glücklich, und wir konnten ruhig reisen.\n\nAls kleines Dankeschön lade ich Sie zum Tee ein. Passt Ihnen der Freitag um 17 Uhr?\n\nHerzliche Grüße\nKarim Ben Ali",
    checkliste: ["شكر محدد على فعل بعينه؟", "أثر المساعدة فيك مذكور؟", "ردّ جميل ملموس مقترح؟", "دفء بلا تكلّف؟"],
  },
];
