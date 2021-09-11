FROM nginx:alpine

COPY nginx/config/ /etc/nginx/
COPY dist/wms /usr/share/nginx/html/
VOLUME /etc/nginx/logs/

CMD ["nginx", "-g", "daemon off;"]
