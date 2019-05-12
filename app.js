app = new Vue({
    el: '#app',
    data: {
        dataset: null
    },
    methods: {
        update: function() {
            let app = this,
                query_id = '6b57db09-1f1d-40fe-bbf2-40de5362ba79',
                token =
                    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OnlldGktcmVhZG9' +
                    'ubHkiLCJpc3MiOiJhZ2VudDp5ZXRpLXJlYWRvbmx5Ojo1Y2Q4YmE5Zi01ZGQ2LTQ4MWU' +
                    'tOWUxOC04NTIwYjIxN2I0Y2QiLCJpYXQiOjE1NTYyMDcwMjUsInJvbGUiOlsidXNlcl9' +
                    'hcGlfcmVhZCIsInVzZXJfYXBpX3dyaXRlIl0sImdlbmVyYWwtcHVycG9zZSI6dHJ1ZSw' +
                    'ic2FtbCI6e319.-7tuD6sdMhjEADykZ0QoMWAUfoXcHXlkpS3KRmLtN465A6wuK2fVtu' +
                    '4y3OO2kqRcPZRkUMUGzAEi_LmCy5uQQQ';

            new Iolanta(url, token).execute_stored_query(
                query_id
            ).then(function (data) {
                app.dataset = data;
            })
        }
    },
    created: function() {
        this.update();
    }
});
