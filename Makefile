all : build

##########################
# CLEANERS
##########################

clean :
	rm -Rf node_modules dist

##########################
# DEPENDENCIES
##########################

deps : with_npm

with_npm :
	npm install

##########################
# BUILD
##########################

build : deps
	npm run build
	npm run test
