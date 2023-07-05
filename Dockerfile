# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build wallet-api`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t wallet-api`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system wallet-api && \
          adduser --system -G wallet-api wallet-api

COPY dist/wallet-api wallet-api
RUN chown -R wallet-api:wallet-api .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix wallet-api --omit=dev -f install

CMD [ "node", "wallet-api" ]