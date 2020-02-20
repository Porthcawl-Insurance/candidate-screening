# frozen_string_literal: true

return unless User.all.count.zero? && !Rails.env.test?

require 'csv'
require 'application_record'
require 'user'
cyber_fortress_seed_file    = File.read(Rails.root.join('db', 'csv', 'dataset.csv'))
cyber_fortress_seed_csv     = CSV.parse(cyber_fortress_seed_file, headers: true, encoding: 'ISO-8859-1')
cyber_fortress_user_hash    = cyber_fortress_seed_csv.map(&:to_h)
cyber_fortress_user_hash.each { |row| row.merge!(password: 'password', password_confirmation: 'password') }
User.create cyber_fortress_user_hash
