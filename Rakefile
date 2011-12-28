$:.unshift File.expand_path(File.join(File.dirname(__FILE__), '../lib'))
require 'yaml'
require 'rubygems'
require 's3'
require 'textpattern'

@config= YAML.load_file('config.yaml')

namespace :s3 do
  desc "sync s3 folder with aws s3"
  task :sync do
    Jekyll::S3.sync @config[:s3]
  end
end

namespace :txp do

  desc "removes archive"
  task :clean do
    system "rm -rf archive"
  end

  desc "import txp blog"
  task :import do
    Jekyll::TextPattern.process @config[:database]
  end

  desc "redo"
  task :redo => [:clean, :import]

end

desc "removes _site"
task :clean do
  system "rm -rf _site"
end

desc "starts jekyll server"
task :server do
  system "jekyll --server"
end

