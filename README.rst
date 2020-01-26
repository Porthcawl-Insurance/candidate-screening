otenki
=======
RESTful API that tells you if it's raining over _______________'s head.

Endpoint(s)
-----------
**/api/rain/{uid}**
  Returns JSON object ``{'is_raining': boolean}`` if the unique id ``uid`` is valid and weather data found, else ``{'error': 'error message'}``.

Web Interface
-------------
**/**
  Raining? Web page displays a "Yes," "No," "Maybe," or error message after a unique id ``uid`` is submitted.

Requirements
------------

- Python 3.6+
- Docker
- PostgreSQL

Run
---
- Clone repository, edit environment values, and run: ::

    $ git clone --single-branch --branch otenki https://github.com/kylepw/candidate-screening.git && cd candidate-screening
    $ cp env_file .env && vim .env
    $ docker-compose up --build

- Note: make sure other instances of PostgreSQL are not running on your machine's port 5432 (``ps aux | grep 'postgres'``).

Usage
-----
- Choose a ``unique_id`` from the database (replace ``???`` below with ``POSTGRES_PASSWORD`` value in ``.env``): ::

    $ psql postgresql://otenki:???@localhost:5432/otenki -c "select unique_id from people;"

- Call the API (replace ``{uid}`` with the ``unique_id``): ::

    $ curl -i http://localhost:8000/api/rain/{uid}

- Or enter the ``unique_id`` from the web interface in your browser: ::

    $ open http://localhost:8000

Tests
-----
::

    $ cd candidate-screening
    $ python -m venv venv && source venv/bin/activate
    (venv) $ pip install --upgrade pip && pip install -r requirements.txt
    (venv) $ docker run --rm --name otenkitest -e POSTGRES_USER=otenkitest -e POSTGRES_PASSWORD=pass -p "5432:5432" -d postgres:12.1
    (venv) $ coverage run -m unittest && coverage report
    (venv) $ docker stop otenkitest

License
-------
`MIT License <https://github.com/kylepw/candidate-screening/blob/master/LICENSE>`_