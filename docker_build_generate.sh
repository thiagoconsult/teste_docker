#!/bin/bash
{
  arg1="NODE_ENV=development"
  arg2="PORT=3000"
  arg3="POSTGRES_HOST=dpg-cq9vrhdds78s739k5sl0-a.oregon-postgres.render.com"
  arg4="POSTGRES_PORT=5432"
  arg5="POSTGRES_USER=cloud_db"
  arg6="POSTGRES_PASSWORD=8Sf75DUqbWm6bdyc4pR5XYs66SEUBEgd"
  arg7="POSTGRES_DB=cloud_db_ilob"
  arg8="JWT_SECRET=xuxadasilva"

  docker build --no-cache -t teste_docker:latest \
  --build-arg=$arg1 --build-arg=$arg2 --build-arg=$arg3 --build-arg=$arg4 \
  --build-arg=$arg5 --build-arg=$arg6 --build-arg=$arg7 --build-arg=$arg8 .
}
