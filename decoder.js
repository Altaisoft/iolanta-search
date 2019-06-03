// RDF types to JavaScript types
const Datatypes = {
    'http://www.w3.org/2001/XMLSchema#boolean': function (value) {
        // Boolean
        return {
            "true": true,
            "false": false
        }[value]
    },
    'http://www.w3.org/2001/XMLSchema#dateTime': function (value) {
        // Datetime
        return new Date(Date.parse(value));
    }
};

const ContentType = {
    construct: 'application/rdf+json',
    select: 'application/sparql-results+json'
};

function interpret_sparql_value(datum) {
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

const Decoder = {
    construct: function(data) {
        return data;
    },
    select: function(data) {
        // Present a SPARQL query result in a human friendly form
        // Suitable for: application/sparql-results+json
        return data.results.bindings.map(function(source) {
            // FIXME this is dirty but https://stackoverflow.com/a/14810722/1245471
            let result = [];
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = interpret_sparql_value(source[key]);
                }
            }
            return result
        })
    }
};
