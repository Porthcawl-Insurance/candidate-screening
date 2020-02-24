# frozen_string_literal: true

require 'spec_helper'

RSpec.describe RainingController, type: :controller do
  it 'renders contact_us' do
    get :index
    expect(response.status).to eq(200)
  end
end
