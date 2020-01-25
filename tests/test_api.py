import os
from otenki import create_app
from otenki.settings import basedir
from otenki.views.api import DataError, HTTPError
import unittest


class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                'TESTING': True,
                'SQLALCHEMY_DATABASE_URI': 'sqlite:///'
                + os.path.join(basedir, 'test.db'),
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
