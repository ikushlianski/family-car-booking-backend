#!/bin/bash

source ./specs/.env.integration

export AWS_PROFILE=family-car-booking
# `development` for DEV env
# `qa` for QA env
export NODE_ENV=development

if [ "$1" != "" ]; then
  jest "$1"
else
  for file in $(find ./specs/features -type f -name "*.feature" -exec basename {} \;); do
     jest "$file"

     exit_status=$?

     if [ $exit_status -gt 0 ]; then
       exit $exit_status
     fi
  done

fi

