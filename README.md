# Purrfect Shop 🐾

En responsiv webbapplikation för en kattbutik byggd med vanilla JavaScript, HTML och CSS. Applikationen hämtar kattinformation från The Cat API och erbjuder funktioner som sökning, filtrering, kundvagn och beställning.

## Funktioner

- **Responsiv design** - Fungerar på mobil, tablet och desktop
- **Kattlista** - Visar katter från The Cat API med pagination (10 per sida)
- **Sökfunktion** - Sök katter på namn
- **Filtrering** - Filtrera på livslängd och egenskaper
- **Kundvagn** - Lägg till katter och gör beställning
- **Musikspelare** - Bakgrundsmusik med kontroller

## Tekniker använda

- **HTML5** - Semantisk struktur
- **CSS3** - Flexbox, Grid, Media queries för responsivitet
- **Vanilla JavaScript** - DOM-manipulation, async/await, fetch API
- **The Cat API** - Extern datahämtning

## Hur man kör projektet

1. Öppna projektet i VS Code
2. Högerklicka på `index.html` och välj "Open with Live Server"
3. Eller använd terminalen: `npx live-server --port=5500`

Applikationen öppnas automatiskt i din webbläsare på `http://localhost:5500`

## Projektstruktur

```
Purrfect-Shop/
├── index.html          # Huvudsidan
├── Style.css           # Globala stilar
├── home.css            # Startsidans styling
├── cats.css            # Kattsidans styling
├── about.css           # Om-sidans styling
├── cart.css            # Kundvagnens styling
├── script.js           # Global JavaScript
├── navigation.js       # Navigeringslogik
├── cats.js             # Katt-API och söklogik
├── cart.js             # Kundvagnsfunktionalitet
└── music.js            # Musikspelare
```

## API

Använder [The Cat API](https://api.thecatapi.com/v1/breeds?limit=30) för att hämta kattinformation.