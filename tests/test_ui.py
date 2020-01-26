from otenki import create_app
import unittest
from unittest.mock import patch


class TestUI(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                'TESTING': True,
                'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
                'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            }
        )
        self.client = self.app.test_client()

    def test_get_request(self):
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'Raining?', r.data)

    def test_post_without_uid(self):
        r = self.client.post('/', data={'uid': None})
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'ID required', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_successful_api_response_with_true(self, mock_get):
        mock_get.return_value = {'is_raining': True}

        r = self.client.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        mock_get.assert_called_once()
        self.assertIn(b'Yes', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_successful_api_response_with_false(self, mock_get):
        mock_get.return_value = {'is_raining': False}

        r = self.client.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        mock_get.assert_called_once()
        self.assertIn(b'No', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_successful_api_response_with_unknown_value(self, mock_get):
        mock_get.return_value = {'is_raining': 'Dunno'}

        r = self.client.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        mock_get.assert_called_once()
        self.assertIn(b'Maybe', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_bad_api_response(self, mock_get):
        mock_get.return_value = {'error': 'No data available'}
        r = self.client.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        self.assertIn(b'No data available', r.data)

    @patch('otenki.views.ui.get_rain_status', side_effect=ValueError())
    def test_value_error(self, mock_get):
        r = self.client.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})
        self.assertIn(b'Invalid ID', r.data)
