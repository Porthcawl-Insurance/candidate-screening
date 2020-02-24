# frozen_string_literal: true

OPEN_WEATHER_API_KEY = Rails.application.credentials.config.dig(:open_weather, :key)
Rails.application.load_seed
