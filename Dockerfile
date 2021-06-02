FROM alpine:edge
RUN apk add --update --no-cache nginx-mod-http-brotli nginx \
  && rm -rf /var/cache/apk/*

COPY nginx/config/ /etc/nginx/
COPY dist/wms /usr/share/nginx/html/
VOLUME /etc/nginx/logs/

CMD ["nginx", "-g", "daemon off;"]
