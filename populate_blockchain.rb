require 'net/http'
require "base64"

sensors = ["sensor-aaa", "sensor-bbb", "sensor-ccc"]
values = (10..22).to_a
30.times do |i|
	b = Base64.encode64("#{values.sample}:#{Time.now.getutc.to_i + i}")
	uri = URI("http://localhost:46657/broadcast_tx_commit?tx=\"sensor:#{sensors.sample}:#{b}\"")
	print i.to_a, uri + "\n"
	encoded_url = URI.encode(url)
	Net::HTTP.get(encoded_url)
end

