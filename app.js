app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        dataset: null
    },
    methods: {
        update: function() {
            let url = 'https://query.data.world/sparql/yeti/sparql-endpoints-catalog',
                token =
                    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OnlldGktcmVhZG9' +
                    'ubHkiLCJpc3MiOiJhZ2VudDp5ZXRpLXJlYWRvbmx5Ojo1Y2Q4YmE5Zi01ZGQ2LTQ4MWU' +
                    'tOWUxOC04NTIwYjIxN2I0Y2QiLCJpYXQiOjE1NTYyMDcwMjUsInJvbGUiOlsidXNlcl9' +
                    'hcGlfcmVhZCIsInVzZXJfYXBpX3dyaXRlIl0sImdlbmVyYWwtcHVycG9zZSI6dHJ1ZSw' +
                    'ic2FtbCI6e319.-7tuD6sdMhjEADykZ0QoMWAUfoXcHXlkpS3KRmLtN465A6wuK2fVtu' +
                    '4y3OO2kqRcPZRkUMUGzAEi_LmCy5uQQQ',
                query = `
                    PREFIX : <https://yeti.linked.data.world/d/sparql-endpoints-catalog/>
                    PREFIX csvw: <http://www.w3.org/ns/csvw#>
          
                    SELECT ?name ?description ?url ?supports_cors WHERE {
                        ?table a csvw:Table .
                        ?row a ?table .
          
                        ?row :col-list1-name ?name .
                        ?row :col-list1-url ?url .
          
                        OPTIONAL {
                            ?row :col-list1-description ?description .
                        }
                        
                        OPTIONAL {
                            ?row :col-list1-supports_cors ?supports_cors .
                        }
                    } ORDER BY ?name
                `;

            app = this;
            new Iolanta(url, token).execute(query).then(function (data) {
                app.dataset = data;
            })
        }
    },
    created: function() {
        this.update();
    }
});
