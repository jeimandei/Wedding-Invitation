FROM nginx:alpine

# Remove default placeholder content
RUN rm -rf /usr/share/nginx/html/*

# Custom nginx config: gzip + cache headers
RUN printf 'server {\n\
    listen 9000;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    gzip on;\n\
    gzip_types text/css application/javascript image/svg+xml image/png image/jpeg;\n\
    gzip_min_length 1024;\n\
\n\
    location ~* \\.(jpg|jpeg|png|gif|svg|ico|webp)$ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
\n\
    location ~* \\.(css|js)$ {\n\
        expires 7d;\n\
        add_header Cache-Control "public";\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copy site files
COPY index.html /usr/share/nginx/html/
COPY css/        /usr/share/nginx/html/css/
COPY js/         /usr/share/nginx/html/js/
COPY images/     /usr/share/nginx/html/images/

EXPOSE 9000
