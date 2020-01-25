import os
from otenki import create_app
from otenki.settings import basedir
import unittest
from unittest.mock import patch


class TestUI(unittest.TestCase):
    def setUp(self):
        app = create_app(
            {
                'TESTING': True,
                'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
                'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            }
        )
        self.client = app.test_client()

    def test_get_request(self):
        with self.client as c:
            r = c.get('/')
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'Raining?', r.data)

    def test_post_without_uid(self):
        with self.client as c:
            r = c.post('/', data={'uid': None})
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'ID required', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_successful_api_response(self, mock_get):
        mock_get.return_value = {'is_raining': True}

        with self.client as c:
            r = c.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        mock_get.assert_called_once()
        self.assertIn(b'Yes', r.data)

    @patch('otenki.views.ui.get_rain_status')
    def test_bad_api_response(self, mock_get):
        mock_get.return_value = {'error': 'No data available'}

        with self.client as c:
            r = c.post('/', data={'uid': '90602e5a-bd07-42bf-812b-60836a655403'})

        self.assertIn(b'No data available', r.data)
