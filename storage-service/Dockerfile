FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --prod

COPY . .

# Create temp upload directory
RUN mkdir -p tmp

EXPOSE 5001

CMD ["node", "index.js"]
