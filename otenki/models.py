from otenki import db
from sqlalchemy.dialects.postgresql import UUID


class People(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(UUID(as_uuid=True), unique=True, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip = db.Column(db.String)
    email = db.Column(db.String)

    def __repr__(self):
        return '<uid: %r>' % self.unique_id

    def to_location_dict(self):
        """Return dict with only location info."""
        return {'city': self.city, 'zip': self.zip}
