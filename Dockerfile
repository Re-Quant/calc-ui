FROM nginx:1.15-alpine

COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./config/nginx/mime.types /etc/nginx/conf.d/mime.types

RUN rm -rf /usr/share/nginx/html/* \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log


COPY ./dist/* /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
