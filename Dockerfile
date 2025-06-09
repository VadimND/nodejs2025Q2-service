# Dockerfile
FROM postgres:16

# Кастомный скрипт инициализации (опционально)
COPY ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh
