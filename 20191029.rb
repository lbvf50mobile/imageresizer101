p "alias x='ruby 20191029.rb'" 
require 'sinatra'
require 'json'
set :public_folder, File.dirname(__FILE__) 
get '/' do
    File.read('index.html')
end