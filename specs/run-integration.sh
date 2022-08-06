#!/bin/bash

source ./specs/.env.integration

export AWS_PROFILE=family-car-booking
export NODE_ENV=qa

if [ "$1" != "" ]; then
  jest "$1"
else
  jest
fi

