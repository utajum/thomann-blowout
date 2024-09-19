#!/bin/bash

#nvm use 22
node --experimental-sea-config sea-config.json

cp $(command -v node) build/thoman-linux

npx postject build/thoman-linux NODE_SEA_BLOB build/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
