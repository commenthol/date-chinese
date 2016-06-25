all: lint transpile readme v6.3

lint:
	eslint --fix --quiet '**/*.js'

transpile:
	npm run transpile

doc:
	jsdox src	

readme:
	markedpp --githubid -i README.md -o README.md

test: v0.12 v4.4 v6.3

v%:
	n $@ && npm test

.PHONY: all, test, lint, transpile
