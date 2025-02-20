FROM node:22-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

ARG NODE_ENV
ARG PORT
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG JWT_SECRET

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV POSTGRES_HOST=$POSTGRES_HOST
ENV POSTGRES_PORT=$POSTGRES_PORT
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_DB=$POSTGRES_DB
ENV JWT_SECRET=$JWT_SECRET

RUN echo "NODE_ENV=${NODE_ENV}" > .env
RUN echo "PORT=${PORT}" > .env
RUN echo "POSTGRES_HOST=${POSTGRES_HOST}" > .env
RUN echo "POSTGRES_PORT=${POSTGRES_PORT}" > .env
RUN echo "POSTGRES_USER=${POSTGRES_USER}" > .env
RUN echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" > .env
RUN echo "POSTGRES_DB=${POSTGRES_DB}" > .env
RUN echo "JWT_SECRET=${JWT_SECRET}" > .env

RUN npm run build

EXPOSE 3000

CMD ["node", "build/server"]
