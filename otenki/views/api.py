from flask import abort, Blueprint, current_app, jsonify
from otenki.models import People
import requests
from requests.exceptions import HTTPError
from sqlalchemy.exc import DataError
from uuid import UUID


API_BASE = f'https://api.openweathermap.org/data/2.5/weather'


api_bp = Blueprint('api', __name__, url_prefix='/api')


def _valid_uuid(id):
    try:
        UUID(id, version=4)
    except ValueError:
        return False
    return True


def get_rain_status(uid):
    """Fetch rain data on `uid`s location.

        Args:
            uid: unique id in UUID format

        Return:
            {'is_raining': boolean}

        Raise:
            ValueError: invalid or unknown UUID `uid`
            HTTPError: lack location data or connetion to OW API fails.

        Note:
            Separate this business logic from view function below so it
            can be called without redirection from ui views.
    """

    if not _valid_uuid(uid):
        raise ValueError
    person = People.query.filter_by(unique_id=uid).first()
    if not person:
        raise ValueError
    p_location = person.to_location_dict()

    # Setup API payload
    payload = {'appid': current_app.config.get('OW_APP_KEY')}
    if p_location['city']:
        payload['q'] = p_location['city']
    elif p_location['zip']:
        payload['zip'] = p_location['zip']
    else:
        current_app.logger.error('No city/zip code available for uid %s', uid)
        raise HTTPError

    # Fetch rain status
    r = requests.get(API_BASE, params=payload)
    r.raise_for_status()
    weather = r.json().get('weather')

    current = ''
    if weather and len(weather) > 0:
        current = weather[0].get('main') or ''

    return {'is_raining': True if 'rain' in current.lower() else False}


@api_bp.route('/rain/<uid>', methods=['GET'])
def rain(uid):
    """Tell whether it's raining or not where in `uid`s location.

        Args:
            uid: unique id in UUID format

        Return:
            JSON object {'is_raining': true/false}

        Raise:
            JSON object {'error': 'message'} with 404 status.
    """

    if current_app.config.get('OW_APP_KEY') is None:
        current_app.logger.error('OpenWeather app key not set!')
        abort(404, 'No data available')

    try:
        result = get_rain_status(uid)
        return jsonify(result)

    except (DataError, ValueError):
        # Invalid uuid syntax
        abort(404, f'Invalid ID: {uid}')
    except HTTPError:
        current_app.logger.error('Failed to connect to OpenWeather API')
        abort(404, 'No data available')
    except Exception:
        abort(404)
