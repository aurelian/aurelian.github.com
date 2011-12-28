require 'aws'
require 'mime/types'
require 'pathname'

module Jekyll
  module S3

    def self.sync(s3_config)
      AWS.config s3_config
      bucket= AWS::S3::Bucket.new s3_config[:bucket]

      Dir["s3/**/**"].each do | e |
        pn = Pathname.new e
        if pn.directory?
          puts "[skip] --> local: #{e} is a directory"
          next
        end

        key = e.gsub(/^s3\//, '')
        o = AWS::S3::S3Object.new bucket, key
        if o.exists?
          puts "[skip] --> s3://#{bucket.name}/#{key} exists"
        else
          puts "[upload] --> #{e} => s3://#{bucket.name}/#{key}"
          o.write :data => pn, :content_type => MIME::Types.type_for(e).first
        end
      end
    end
  end
end
