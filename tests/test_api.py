from otenki import create_app, db
from otenki.models import People
from otenki.views.api import get_rain_status, HTTPError, _valid_uuid
import unittest
from unittest.mock import patch
from uuid import uuid4


class TestValidUuid(unittest.TestCase):
    def test_bad_uuid(self):
        self.assertFalse(_valid_uuid('breakfast'))

    def test_valid_uuid(self):
        self.assertTrue(_valid_uuid(str(uuid4())))


class TestGetRainStatus(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                'TESTING': True,
                'SQLALCHEMY_DATABASE_URI': 'postgresql://otenkitest:pass@localhost:5432/otenkitest',
                'SQLALCHEMY_TRACK_MODIFICATIONS': False,
                'OW_APP_KEY': '12345',
            }
        )
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            self.populate_db()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def populate_db(self):
        """Add data to database."""

        # Will use in other tests
        self.has_loc_uid = str(uuid4())
        self.no_loc_uid = str(uuid4())

        p1 = People(
            last_name='Bond',
            first_name='Harry',
            unique_id=self.has_loc_uid,
            city='Los Angeles',
            zip='90001',
        )
        no_loc = People(
            last_name='Appleseed',
            first_name='Johnny',
            unique_id=self.no_loc_uid,
            city='Austin',
            zip='73301',
        )
        for p in (p1, no_loc):
            db.session.add(p)
        db.session.commit()

    def test_non_existing_uuid(self):
        with self.app.app_context():
            with self.assertRaises(ValueError):
                get_rain_status(str(uuid4()))

    def test_person_without_a_city_or_zipcode(self):
        with self.app.app_context():
            with self.assertRaises(HTTPError):
                get_rain_status(self.no_loc_uid)

    @patch('otenki.views.api.requests.get')
    def test_valid_uid_with_successful_response(self, mock_get):
        with self.app.app_context():
            mock_get.return_value.json.return_value = {'weather': [{'main': 'Rain'}]}
            self.assertEqual(get_rain_status(self.has_loc_uid), {'is_raining': True})

    @patch('otenki.views.api.requests.get')
    def test_valid_uid_with_unsuccesful_response(self, mock_get):
        with self.app.app_context():
            mock_get.return_value.json.return_value = {'weather': []}
            self.assertEqual(get_rain_status(self.has_loc_uid), {'is_raining': False})


class TestRain(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                'TESTING': True,
                'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
                'SQLALCHEMY_TRACK_MODIFICATIONS': False,
                'OW_APP_KEY': '12345',
            }
        )
        self.client = self.app.test_client()

    def test_no_ow_app_key(self):

        self.app.config['OW_APP_KEY'] = None

        with self.app.test_client() as c:
            r = c.get('/api/rain/')
        self.assertIn('error', r.json)
        self.assertEqual(r.status_code, 404)

    def test_bad_uuid_value(self):
        with self.client as c:
            r = c.get('/api/rain/$$$')
        self.assertEqual(r.status_code, 404)
        self.assertIn(b'Invalid ID', r.data)

    @patch('otenki.views.api.get_rain_status', side_effect=HTTPError())
    def test_http_error(self, mock_get_rain_status):
        with self.app.app_context():
            with patch('otenki.views.api.current_app.logger.error') as mock_error:
                with self.client as c:
                    r = c.get('/api/rain/123')
        mock_error.assert_called_once()
        self.assertEqual(r.status_code, 404)
        self.assertIn(b'No data available', r.data)

    @patch('otenki.views.api.get_rain_status', side_effect=Exception())
    def test_other_error(self, mock_get_rain_status):
        with self.app.app_context():
            with self.client as c:
                r = c.get('/api/rain/123')
        self.assertEqual(r.status_code, 404)
        self.assertIn(b'404 Not Found', r.data)
