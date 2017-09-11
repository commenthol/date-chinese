all: lint transpile readme v8.

lint:
	npm run lint

transpile:
	npm run transpile

doc:
	jsdox src	

readme:
	markedpp --githubid -i README.md -o README.md

test: v0.12 v4. v6. v8.

v%:
	n $@ && npm test

.PHONY: all, test, lint, transpile
