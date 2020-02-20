# frozen_string_literal: true

RSpec.describe User::RainingStatus, type: :model do
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

  let(:user) { User.new user_hash }
  let(:new) { described_class.new(user) }

  describe '#new' do
    context 'with a non User object' do
      let(:user) { {} }

      it('returns nil if not a user object') { expect(new.user).to eq nil }
    end

    context 'with a user object' do
      it('initializes') { expect(new).to be_a described_class }
      it('sets user attribute') { expect(new.user).to be_a User }
    end
  end

  describe '#should_update_raining?' do
    it 'for nil raining_updated_at' do
      new.user.raining_updated_at = nil
      expect(new.should_update_raining?).to eq true
    end

    it 'for a refreshed_at in the past' do
      allow(new).to receive(:raining_status_can_be_refreshed_at) { DateTime.now - 1.minute }
      expect(new.should_update_raining?).to eq true
    end

    it 'for a refreshed_at in the future' do
      allow(new).to receive(:raining_status_can_be_refreshed_at) { DateTime.now + 1.minute }
      expect(new.should_update_raining?).to eq false
    end
  end

  describe '#raining_status_can_be_refreshed_at' do
    it 'returns nil for nil raining_updated_at' do
      new.user.raining_updated_at = nil
      expect(new.raining_status_can_be_refreshed_at).to eq nil
    end

    it 'returns caculcated datetime' do
      expect(new.raining_status_can_be_refreshed_at).to eq user.raining_updated_at + 1.hour
    end
  end

  describe '#update_is_it_raining' do
    context 'with nil weather_service' do
      it 'updates user' do
        allow(new).to receive(:return_weather_service).and_return(nil)
        expect { new.update_is_it_raining }.to change(new.user, :raining).to(nil)
        expect { new.update_is_it_raining }.to change(new.user, :raining_updated_at).to(nil)
      end
    end

    context 'with true weather_service' do
      it 'updates user' do
        allow(new).to receive(:return_weather_service).and_return(true)
        expect { new.update_is_it_raining }.to change(new.user, :raining_updated_at)
      end
    end

    context 'with true weather_service' do
      it 'updates user' do
        allow(new).to receive(:return_weather_service).and_return(false)
        expect { new.update_is_it_raining }.to change(new.user, :raining).to(false)
        expect { new.update_is_it_raining }.to change(new.user, :raining_updated_at)
      end
    end
  end

  describe '#return_weather_service' do
    let(:weather_service) { instance_double('WeatherService') }

    it do
      allow(WeatherService).to receive(:new) { weather_service }
      allow(weather_service).to receive(:raining?).and_return(true)
      expect(new.return_weather_service).to eq true
    end
  end

  describe '#attributes' do
    let(:static_time) { DateTime.new 2020, 1, 1, 1, 1, 1 }

    it 'formats' do
      allow(new).to receive(:raining_status_can_be_refreshed_at) { static_time }
      expect(new.attributes).to eq(raining: user.raining, raining_status_can_be_refreshed_at: static_time)
    end
  end
end
