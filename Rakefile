$:.unshift File.expand_path(File.join(File.dirname(__FILE__), '../lib'))
require 'yaml'
require 'rubygems'

desc "sync assets"
task :sync do
  system "aws s3 sync _assets s3://assets.locknet.ro/"
end

desc "removes _site"
task :clean do
  system "rm -rf _site"
end

desc "starts jekyll server"
task :server do
  system "bundle exec jekyll serve --watch --drafts"
end
