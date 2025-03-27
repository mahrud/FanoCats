all:	serve

check:; bundle exec jekyll build -d _site/LearnM2
	bundle exec htmlproofer ./_site

serve:;	bundle exec jekyll serve -s . -d _site/
build:;	bundle exec jekyll build -s . -d _site/
push:	build
	git add _cache && \
	git commit -m "generated cache on `date`" && \
	git push

clean: clean-sites
clean-sites:; rm -rf _site/*
clean-cache:; rm -rf _cache/*.m2

install:
	gem install jekyll
	gem install bundler
	bundle config set path 'vendor/bundle'
	bundle install
