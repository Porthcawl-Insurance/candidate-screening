# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  def to_token_payload
    {
      sub: id,
      email: email
    }
  end

  def raining_status
    User::RainingStatus.new(self).attributes
  end
end
