# Etape 1 : compilation du projet
FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm ci
RUN npm run build

# Etape 2 : utilisation d'une image de serveur http pour servir le site précompilé
FROM nginx:1.25.1-alpine
EXPOSE 8080
# Le nom du fichier est `nginx-ui.conf` dans votre template, j'utilise `default.conf` pour la cohérence avec docker-compose.
# On transforme "/app/build" en "/app/dist" car on utilise vite
COPY --chown=nginx:nginx nginx-ui.conf /etc/nginx/conf.d/default.conf 
COPY --chown=nginx:nginx --from=builder /app/dist /var/www/html/