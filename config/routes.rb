# frozen_string_literal: true

Rails.application.routes.draw do
  root 'raining#index'
  namespace :api do
    namespace :v1 do
      post 'user_token' => 'user_token#create'
      get 'raining' => 'raining#index'
    end
  end
end
