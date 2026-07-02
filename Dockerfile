FROM node:24.1.0-bookworm
RUN npm install -g npm@11.5.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
# production server (next start) — no dev-server host checks
CMD ["npm", "run", "start"]
