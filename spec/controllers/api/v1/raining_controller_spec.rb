# frozen_string_literal: true

RSpec.describe Api::V1::RainingController, type: :controller do
  let(:user_hash) do
    {
      address_1: 'address_1',
      city: 'city',
      state: 'state',
      zip: '1111',
      email: 'email@email.com',
      first_name: 'first_name',
      last_name: 'last_name',
      password: 'password',
      password_confirmation: 'password',
      raining: true,
      raining_updated_at: DateTime.now
    }
  end

  let(:user) { User.create user_hash }
  let(:user_authorized_header) do
    token = Knock::AuthToken.new(payload: { sub: user.id, email: user.email }).token
    { 'Authorization': "Bearer #{token}" }
  end

  describe 'get#index' do
    context 'with no jwt token' do
      it 'is unauthorized' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with an invalid jwt token' do
      it 'is unauthorized' do
        request.headers[:Authorization] = 'Bearer hamsterparty'
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with a valid token' do
      it 'is authorized and returns json' do
        request.headers.merge!(user_authorized_header)
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).keys).to eq %w[raining raining_status_can_be_refreshed_at]
      end
    end
  end
end
