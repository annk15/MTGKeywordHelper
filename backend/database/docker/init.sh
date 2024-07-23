#!/bin/bash

mysql --protocol=tcp -u root -ppassword -P 3307 < ./init.sql

