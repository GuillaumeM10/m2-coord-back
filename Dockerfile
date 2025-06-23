FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /agenda
WORKDIR /agenda
RUN pnpm install


FROM base AS api
WORKDIR /agenda/apps/api
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start"]

FROM base AS auth
WORKDIR /agenda/apps/auth
RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "start"]

FROM base AS jobrunner
WORKDIR /agenda/apps/jobrunner
RUN pnpm run build

EXPOSE 3004
CMD ["pnpm", "start"]

FROM base AS ui
WORKDIR /agenda/apps/ui
RUN pnpm run build

EXPOSE 5173
CMD ["pnpm", "dev"]

