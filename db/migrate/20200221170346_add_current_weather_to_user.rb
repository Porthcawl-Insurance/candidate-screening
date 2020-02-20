# frozen_string_literal: true

class AddCurrentWeatherToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :raining, :boolean
    add_column :users, :raining_updated_at, :datetime
  end
end
