# frozen_string_literal: true

RSpec.describe User, type: :model do
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

  let(:user) { described_class.new user_hash }

  it 'creates a user' do
    expect { described_class.create(user_hash) }.to change(described_class, :count).by 1
  end

  describe '#to_token_payload' do
    it('sets the correct attributes') { expect(user.to_token_payload).to eq(sub: user.id, email: user.email) }
  end

  describe '#raining_status' do
    it('is a hash') { expect(user.raining_status).to be_a Hash }
  end
end
