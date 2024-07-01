FROM node:20-bullseye As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:20-bullseye As build

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:20.11-alpine as production

WORKDIR /app

COPY --chown=node:node --from=build /usr/src/app/package.json           ./package.json
COPY --chown=node:node --from=build /usr/src/app/package-lock.json      ./package-lock.json
COPY --chown=node:node --from=build /usr/src/app/node_modules           ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist                   ./dist

ENTRYPOINT ["node", "dist/main.js"]