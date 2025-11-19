Arquitetura

- client (React + Vite + Tailwind): UI para upload do vídeo e parâmetro de intervalo.
- server (Node + Express + Multer + FFmpeg): recebe o vídeo, extrai frames e expõe as imagens via HTTP.
Como Rodar

- Backend:
  - cd server
  - npm install
  - npm start (sobe em http://localhost:5000 )
- Frontend:
  - cd client
  - npm install
  - npm run dev (acessa http://localhost:5173 )
- Uso:
  - Abra o frontend, selecione um arquivo de vídeo e defina o “Intervalo (segundos)”.
  - Envie; o backend extrai os frames e retorna uma lista de URLs, que o frontend exibe como imagens.
Principais Pontos no Código

- Upload e extração de frames:
  - Rota POST '/upload' com multer salva o vídeo e usa FFmpeg para extrair frames em um intervalo de N segundos.
  - Implementação da rota: server/index.js:32
  - Definição do intervalo e validação: server/index.js:35-37
  - Configuração de FPS para FFmpeg ( fps=1/N ): server/index.js:41
  - Saída dos frames com qualidade boa ( -qscale:v 2 ): server/index.js:46
  - Listagem e composição das URLs públicas: server/index.js:53-59
  - Servir diretório de frames: server/index.js:24
- FFmpeg:
  - Caminho do binário via ffmpeg-static : server/index.js:14
- Frontend (upload + exibição):
  - Envio do FormData com video e intervalSec : client/src/App.jsx:18-26, 23
  - Tratamento de loading/erro e renderização das imagens: client/src/App.jsx:22, 27-35, 71-76
- Tailwind configurado:
  - Configuração de conteúdo e tema: client/tailwind.config.js
  - PostCSS: client/postcss.config.js
  - Diretivas @tailwind em client/src/index.css
- Vite React Plugin e portas:
  - Configuração do Vite: client/vite.config.js
  - Scripts em client/package.json para dev , build , preview .
Dependências

- Frontend: react , react-dom , vite , @vitejs/plugin-react , tailwindcss , postcss , autoprefixer .
- Backend: express , cors , multer , fluent-ffmpeg , ffmpeg-static , uuid .
Notas de Execução (Windows/PowerShell)

- Se o PowerShell bloquear scripts do npm / npx por política de execução, execute: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass antes dos comandos.
- FFmpeg é resolvido automaticamente por ffmpeg-static , sem precisar instalar manualmente.
