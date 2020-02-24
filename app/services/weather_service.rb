# frozen_string_literal: true

require 'net/http'

class WeatherService
  attr_accessor :zip

  def initialize(zip_code:)
    @zip = zip_code
  end

  def raining?
    return unless received_weather_code

    raining_weather_codes.include? received_weather_code
  end

  def raining_weather_codes
    [359, 356, 353, 314, 311, 308, 305, 302, 299, 296, 293, 284, 281, 266, 263, 176, 143]
  end

  private

  #    :nocov:
  def convert_zip_to_string
    @zip.to_s.rjust(5, '0')
  end

  def api_endpoint
    "http://api.weatherstack.com/current?access_key=#{OPEN_WEATHER_API_KEY}&query=#{convert_zip_to_string}"
  end

  def get
    Net::HTTP.get(URI(api_endpoint))
  end

  def json
    JSON.parse(get)
  rescue StandardError
    {}
  end

  def received_weather_code
    json.dig('current', 'weather_code')
  end
  #    :nocov:
end
