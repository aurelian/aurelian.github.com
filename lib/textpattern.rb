require 'rubygems'
require 'sequel'
require 'fileutils'

module Jekyll
  module TextPattern

    QUERY = "select ID, LastMod, url_title, Title, Excerpt, Body, textile_body, textile_excerpt from textpattern where Status = 4 and Posted < '2010-01-01 00:00:01' and Section in ('article', 'projects') order by LastMod"

    def self.process(config)
      db = Sequel.mysql(config.delete(:db), config)
      FileUtils.mkdir_p "archive"
      posts = []

      db[QUERY].each do | post |
        title = post[:Title]
        date  = post[:LastMod]
        slug  = post[:url_title]
        ext   = (post[:textile_excerpt] == 1 && post[:Excerpt] != "")? "textile" : (post[:textile_body] == 0)? "html" : "textile"

        p = {}

        p["id"]        = post[:ID]
        p["url"] = "/archive/#{date.strftime("%Y-%m-%d")}-#{slug}"
        p["filename"]  = ".#{p["url"]}.#{ext}"
        p["title"]     = title
        p["layout"]    = "archive"
        p["date"]      = post[:LastMod]

        p["content"]  = ""
        p["content"] << post[:Excerpt] if post[:Excerpt] != ""
        p["content"] << post[:Body]
        posts << p
      end

      posts.each_with_index do | post, i |
        puts "--> #{post["id"]} -- #{post["filename"]}"
        body = post.delete("content")
        body= body.gsub("http://www.locknet.ro/images", "http://assets.locknet.ro/images")
        body= body.gsub("http://locknet.ro/images", "http://assets.locknet.ro/images")
        body= body.gsub("http://locknet.ro/charts", "http://assets.locknet.ro/charts")

        body= body.gsub("http://www.locknet.ro/charts", "http://assets.locknet.ro/charts")
        body= body.gsub("http://locknet.ro/open-flash-chart.swf", "http://assets.locknet.ro/charts/open-flash-chart.swf")
        body= body.gsub("http%3A%2F%2Flocknet.ro%2Fcharts%2F", "http%3A%2F%2Fassets.locknet.ro%2Fcharts%2F")
        body= body.gsub("\r", "\n")

        file = post.delete("filename")

        post["next"]= {"url" => "#{posts[i+1]["url"]}.html", "title" => posts[i+1]["title"]} rescue nil
        post["prev"]= {"url" => "#{posts[i-1]["url"]}.html", "title" => posts[i-1]["title"]} rescue nil

        content = "#{post.to_yaml.force_encoding('UTF-8')}\n---\n\n#{body.force_encoding('UTF-8')}"
        File.open(file, "w"){|f| f.puts content}
      end

      # archive.html
      content = {"layout" => "default", "title" => "Old blog"}.to_yaml
      content << "---\n<p>Old articles</p><ul>"
      content << posts.sort{|a,b| b["date"]<=>a["date"]}.map{|p| "<li>#{p["date"].strftime("%d %B, %Y")} &ndash; <a href=\"#{p["url"]}.html\">#{p["title"]}</a></li>"}.join("\n")
      content << "</ul>"
      File.open("archive.html", "w"){|f| f.puts content}

    end
  end
end
