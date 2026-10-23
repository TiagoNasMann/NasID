# NasID — versão alfa 0.1.0-alpha.1

Reconstrução local da interface publicada em https://xxs-team-6.adalo.com/gov-br-2081.
HTML, CSS e JavaScript legíveis, sem framework, pacote externo ou etapa de compilação.
O site ocupa a tela inteira: não inclui moldura, relógio ou notch de celular.

## Abrir no VS Code

Abra esta pasta. Para visualizar, use a extensão Live Server em `index.html` ou execute:

```sh
node server.mjs
```

Abra http://127.0.0.1:4173. Para testar o layout mobile, use o modo responsivo do navegador.
Também é possível abrir `index.html` diretamente; para persistência consistente da foto,
prefira usar sempre o mesmo endereço e porta do servidor local.

## Organização

- `index.html`: estrutura principal e diálogos acessíveis.
- `css/styles.css`: cores, medidas, telas e adaptação à área segura do dispositivo.
- `js/app.js`: dados fictícios, telas, navegação e editor da foto.
- `assets/`: imagens locais e retrato inicial neutro.
- `server.mjs`: servidor opcional que atende apenas no próprio computador.

## Trocar a foto

1. Abra **Carteira → Carteira de Identidade**.
2. Toque no retrato ou em **⋮ → Alterar foto**.
3. Selecione um JPG, PNG ou WebP de até 10 MB.
4. Ajuste zoom e posição; toque em **Salvar foto**.

A imagem é recortada para 450 × 600 pixels e persistida em `localStorage`.
Ela não é enviada a terceiros. Ao cancelar, o retrato anterior permanece.
Limpar os dados do navegador remove a foto. Outros navegadores não compartilham esse armazenamento.

## Escopo e diferenças da referência

Este código não é uma exportação do projeto Adalo. Reproduz a estrutura visual observada,
com componentes editáveis. Não foi possível recuperar o código-fonte, banco ou ações internas.
A identidade foi reconstruída com dados fictícios, o nome “DOCUMENTO DEMONSTRATIVO” e identificador inválido; o retrato original
e os dados pessoais da referência não foram copiados. O fundo e ornamentos do cartão são
uma textura decorativa recriada por geração de imagem, sem reproduzir elementos de autenticação.
O campo Nome continua sendo texto HTML, separado do arquivo de textura.

As quatro páginas do documento, busca e diálogos têm comportamento local. Serviços que não
foram acessíveis na referência usam estados vazios explícitos. Não há autenticação real,
assinatura digital, validação de documentos ou vínculo com serviços públicos. O QR local
contém apenas os dados fictícios em JSON, sem endereço de validação externo.
Não há backend. O repositório de destino é `TiagoNasMann/NasID`, na branch `main`.

## Publicação na Vercel

Importe o repositório na Vercel. A configuração `vercel.json` usa o comando
`node scripts/build.mjs` e publica somente a pasta `dist/`. Não são necessárias
variáveis de ambiente, chaves ou banco de dados. A foto permanece no navegador
de cada visitante e não é incluída no repositório nem no deploy.

Esta versão alfa contém diferenças visuais em relação à referência e serviços
simulados, conforme o escopo acima.

## Verificação rápida

```sh
node --check js/app.js
node --check server.mjs
```

No navegador, confira navegação, busca, cancelar/salvar foto e recarregar a página.
