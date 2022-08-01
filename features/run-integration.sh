#!/bin/bash

tsc

source ./features/.env.integration

export AWS_PROFILE=family-car-booking
export NODE_ENV=qa

cucumber-js
