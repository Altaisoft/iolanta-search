// RDF types to JavaScript types
Datatypes = {
    'http://www.w3.org/2001/XMLSchema#boolean': function(value) {
        // Boolean
        return {
            "true": true,
            "false": false
        }[value]
    },
    'http://www.w3.org/2001/XMLSchema#dateTime': function(value) {
        // Datetime
        return new Date(Date.parse(value));
    }
};


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

    static interpret_sparql_value(datum) {
        let value = datum.value,
            datatype = datum.datatype;

        if (datatype) {
            // We have data type defined, we are expected to convert literal
            // to assume that data type.
            let type_function = Datatypes[datatype];

            if (type_function) {
                return type_function(value);
            } else {
                console.log(
                    `Datatype ${datatype} has no defined conversion `
                    + `function. Value: ${value}.`
                )
            }
        }

        return value;
    }

    static interpret_sparql_response(data) {
        // Present a SPARQL query result in a human friendly form
        return data.results.bindings.map(function(source) {
            // FIXME this is dirty but https://stackoverflow.com/a/14810722/1245471
            let result = [];
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = Iolanta.interpret_sparql_value(source[key]);
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
                    let clean_data = Iolanta.interpret_sparql_response(data);
                    console.log(clean_data);
                    resolve(clean_data);
                })
            });
        });
    }
}
