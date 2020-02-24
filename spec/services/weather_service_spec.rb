# frozen_string_literal: true

RSpec.describe WeatherService, type: :model do
  let(:zip_integer) { 123 }
  let(:new) { described_class.new(zip_code: zip_integer) }

  describe '#new' do
    it('sets the zip attribute') { expect(new.zip).to eq zip_integer }
  end

  describe '#raining' do
    context 'with invalid response' do
      it 'returns nil' do
        allow(new).to receive(:received_weather_code).and_return(nil)
        expect(new.raining?).to eq nil
      end
    end

    context 'with valid response' do
      it 'returns true if raining' do
        allow(new).to receive(:received_weather_code).and_return(359)
        expect(new.raining?).to eq true
      end

      it 'returns false if not raining' do
        allow(new).to receive(:received_weather_code).and_return(0)
        expect(new.raining?).to eq false
      end
    end
  end

  describe '#raining_weather_codes' do
    it('is an array') { expect(new.raining_weather_codes).to be_a Array }
  end
end
