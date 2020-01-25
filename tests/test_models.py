from otenki.models import People
import unittest


class TestModels(unittest.TestCase):
    def setUp(self):
        self.p1 = People(last_name='Bean', first_name='Jim', city='Philly', zip='12345')

    def test_repr(self):
        self.assertIn('<uid:', repr(self.p1))

    def test_to_location_dict(self):
        p1_loc = self.p1.to_location_dict()

        self.assertEqual(len(p1_loc), 2)
        self.assertIn('city', p1_loc)
        self.assertIn('zip', p1_loc)
        self.assertEqual(self.p1.city, p1_loc['city'])
        self.assertEqual(self.p1.zip, p1_loc['zip'])
