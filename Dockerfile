# Estágio 1: Instalar dependências e buildar o projeto
FROM node:20-slim AS build-stage
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes
COPY package*.json ./

# Instala as dependências do projeto
RUN npm ci

# Copia o restante dos arquivos do projeto
COPY . .

# Executa o comando de build do Vite (gera a pasta dist)
RUN npm run build

# Estágio 2: Servir os arquivos estáticos com o gostatic
FROM pierrezemb/gostatic
# Copia APENAS o resultado do build do estágio anterior
COPY --from=build-stage /app/dist /srv/http/

CMD ["-port","8080","-https-promote", "-enable-logging"]
