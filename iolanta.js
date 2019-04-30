class Iolanta {
    // This is a primitive class encapsulating a SPARQL endpoint.
    constructor(url, token) {
        this.url = url;
        this.token = token;

        // FIXME cannot make it a class property, Chrome doesn't like it
        // Though MDN approves:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
        this.content_type = 'application/sparql-results+json';
    }

    static interpret_sparql_response(data) {
        // Present a SPARQL query result in a human friendly form
        return data.results.bindings.map(function(source) {
            // FIXME this is dirty but https://stackoverflow.com/a/14810722/1245471
            let result = [];
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = source[key].value;
                }
            }
            return result
        })
    }

    execute(query) {
        var self = this;
        return new Promise(function(resolve) {
            fetch(self.url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    accept: self.content_type,
                    authorization: `Bearer ${self.token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    query: query
                }).toString()
            }).then(function(response) {
                response.json().then(function(data) {
                    console.log(data);
                    resolve(Iolanta.interpret_sparql_response(data));
                })
            });
        });
    }
}
