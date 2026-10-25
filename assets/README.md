# Recursos visuais

- `logo.avif`, `home.avif`, `wallet-cover.avif`: imagens públicas observadas na interface Adalo de referência.
- `portrait.svg`: ilustração neutra inicial; a foto escolhida fica no navegador.
- `identity-qr.svg`: QR de dados fictícios em JSON, sem validação oficial.
- `identity-texture.png`: recriação decorativa gerada com a ferramenta nativa de imagens.
- `brasao-republica.png`: PNG oficial das Armas Nacionais, obtido no [site do Planalto](https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/brasao-da-republica). Arquivo preservado; as margens transparentes são recortadas visualmente pelo CSS.

A textura não contém textos ou dados pessoais. O texto “DOCUMENTO DEMONSTRATIVO” é renderizado no campo Nome pelo código em `js/app.js`.

## Prompt utilizado para a textura

Use case: style-transfer. Asset type: decorative background texture for a clearly labeled fictional film-prop document UI. The reference is a portrait screenshot of a landscape card rotated clockwise. Generate ONLY a new abstract background texture, in LANDSCAPE aspect ratio 580:364, with no card, border, photograph, text, numbers, signatures, official insignia, QR code, microprinting or security features. Match the reference's overall visible palette and sweeping broad ribbon shapes: pale yellow-green cream center; pale turquoise woven dots at upper left and lower right; fine soft cream and light yellow curved linework across sweeping bands; softly faded white area on the lower-left for a portrait overlay; restrained low-contrast intricate ornamental waves, visually resembling patterned stationery. Rotate the reference's visual composition counterclockwise into natural landscape orientation. Keep a fairly clean pale central band so black overlaid HTML text is readable. This is a decorative approximation for a DEMONSTRATIVO-labelled film prop, not a reproduction of authentic security artwork. Do not include any person's identity data or any text whatsoever. Fill the full rectangular canvas edge-to-edge.

- `brasil-referencia.png`: recorte do mapa do Brasil da referência Adalo fornecida, com fundo transparente; sem foto ou dados pessoais.
