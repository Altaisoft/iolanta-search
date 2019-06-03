String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


class Iolanta {
    // This is a primitive class encapsulating a SPARQL endpoint.
    constructor(token) {
        // this.url = url;
        this.token = token;

        // FIXME cannot make it a class property, Chrome doesn't like it
        // Though MDN approves:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
        this.content_type = 'application/sparql-results+json';
    }

    static interpret_sparql_response(data) {

    }

    execute(query) {
        let self = this;
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
                    let clean_data = Iolanta.interpret_sparql_response(data);
                    console.log(clean_data);
                    resolve(clean_data);
                })
            });
        });
    }

    execute_stored_query(query_id, type='select') {
        let self = this,
            url = `https://api.data.world/v0/queries/${query_id}/results`;

        let interpreter = Decoder[type];

        return new Promise(function(resolve) {
            fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    accept: ContentType[type],
                    authorization: `Bearer ${self.token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response) {
                response.json().then(function(data) {
                    console.log(data);
                    let clean_data = interpreter(data);
                    resolve(clean_data);
                })
            });
        });
    }
}
