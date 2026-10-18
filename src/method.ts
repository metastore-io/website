/**
 * The German text of the app's method page, copied from metastore-io/app
 * (apps/mobile/src/shared/config/i18n/locales/de/pages.json, key `method`). Every sentence is a rule
 * the app enforces; when the app's text changes, copy it here in the same week.
 */
export const method = {
  "title": "So wählen wir aus",
  "intro": "Was über die Reihenfolge der Vorschläge entscheidet und womit Metastore Geld verdient.",
  "sections": [
    {
      "header": "Niemand kauft sich einen Platz",
      "body": "Shops können keinen Platz und keine bessere Position in den Vorschlägen kaufen. Die Reihenfolge berechnet eine feste Formel, die nicht weiß, ob uns ein Shop etwas zahlt."
    },
    {
      "header": "So entsteht die Reihenfolge",
      "body": "Wir vergleichen die Smartphones, die alles erfüllen, was du ausgewählt hast. Eine feste, versionierte Formel gewichtet ihre Daten nach dem, was dir wichtig ist: Gleiche Kriterien ergeben immer die gleiche Reihenfolge. Eine KI formuliert nur die Begründung und darf dabei nur Produkte und Preise aus dem Vergleich nennen."
    },
    {
      "header": "Der Gesamtpreis",
      "body": "Wir vergleichen Preise inklusive Mehrwertsteuer und Versand. Nennt ein Shop keine Versandkosten, rechnen wir sie nie als kostenlos: Das Angebot zeigt „+ Versand“ und steht am Ende."
    },
    {
      "header": "Nur was wir gemessen haben",
      "body": "Bei jedem Preis steht, wann wir ihn zuletzt bestätigt haben. Angebote, die wir in den letzten {{hours}} Stunden nicht bestätigen konnten, lassen wir weg. Schätzungen wie die Kosten über die Nutzungsdauer sind als Schätzung markiert."
    },
    {
      "header": "Womit wir Geld verdienen",
      "body": "Links zu Shops sind Werbelinks (Affiliate-Links). Kaufst du über einen davon, zahlt uns der Shop eine Provision. Dein Preis bleibt gleich. Den Link fügen wir erst ein, wenn du zum Shop wechselst, also nachdem die Reihenfolge feststeht."
    }
  ]
} as const;
