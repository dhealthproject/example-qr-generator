#!/bin/bash
#
# This file is part of YourDLT shared under AGPL-3.0
# Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
#
# @package     YourDLT
# @author      Gregory Saive for Using Blockchain Ltd <greg@ubc.digital>
# @license     AGPL-3.0
#
./node_modules/minify/bin/minify.js \
  src/Storage.js \
  src/Repository.js \
  src/View.js \
  src/QRCode.js \
  src/Showcase.js > resources/showcase.min.js