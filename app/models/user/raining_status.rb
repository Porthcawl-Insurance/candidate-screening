# frozen_string_literal: true

class User
  class RainingStatus
    attr_accessor :user
    def initialize(user)
      return unless user.class == User

      @user = user
      update_is_it_raining if @user.raining.nil? || should_update_raining?
    end

    def should_update_raining?
      return true unless @user.raining_updated_at

      DateTime.now.after? raining_status_can_be_refreshed_at
    end

    def raining_status_can_be_refreshed_at
      return unless @user.raining_updated_at

      @user.raining_updated_at + 1.hour
    end

    def update_is_it_raining
      case return_weather_service
      when nil
        @user.update raining: nil,
                     raining_updated_at: nil
      when true
        @user.update raining: true,
                     raining_updated_at: DateTime.now
      else
        @user.update raining: false,
                     raining_updated_at: DateTime.now
      end
    end

    def return_weather_service
      WeatherService.new(zip_code: @user.zip).raining?
    end

    def attributes
      {
        raining: @user.raining,
        raining_status_can_be_refreshed_at: raining_status_can_be_refreshed_at
      }
    end
  end
end
