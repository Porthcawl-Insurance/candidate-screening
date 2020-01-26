from .api import get_rain_status
from flask import Blueprint, render_template, request
from requests.exceptions import HTTPError


ui_bp = Blueprint('ui', __name__)


@ui_bp.route('/', methods=['GET', 'POST'])
def rain():
    """Simple page that utilizes '/api/rain/{uid}' endpoint.

        Displays a "Yes," "No," "Maybe," or error message after
        uid value is submitted with form.
    """

    if request.method == 'POST':
        uid = request.form.get('uid')
        if not uid:
            return render_template('rain.html', result='ID required')

        # Call API
        try:
            r = get_rain_status(uid)
        except ValueError:
            r = {'error': f'Invalid ID: {uid}'}
        except HTTPError:
            r = {'error': 'No data available'}

        if 'error' in r:
            result = r.get('error', 'No data available')
        else:
            is_raining = r.get('is_raining')
            if is_raining is True:
                result = 'Yes'
            elif is_raining is False:
                result = 'No'
            else:
                result = 'Maybe'

        return render_template('rain.html', result=result)

    return render_template('rain.html')
