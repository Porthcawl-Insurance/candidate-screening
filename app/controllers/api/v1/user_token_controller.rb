# frozen_string_literal: true

module Api
  module V1
    class UserTokenController < Knock::AuthTokenController
      skip_before_action :verify_authenticity_token

      def entity_name
        'User'
      end
    end
  end
end
