# frozen_string_literal: true

module Api
  module V1
    class RainingController < ApplicationController
      include Knock::Authenticable
      before_action :set_default_format
      before_action :authenticate_user
      before_action :set_current_raining_status

      def index
        render json: @user_raining_status.to_json
      end

      private

      def set_default_format
        request.format = :json
      end

      def set_current_raining_status
        @user_raining_status = current_user&.raining_status
      end
    end
  end
end
