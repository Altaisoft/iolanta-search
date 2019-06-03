let TOKEN =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OnlldGktcmVhZG9' +
    'ubHkiLCJpc3MiOiJhZ2VudDp5ZXRpLXJlYWRvbmx5Ojo1Y2Q4YmE5Zi01ZGQ2LTQ4MWU' +
    'tOWUxOC04NTIwYjIxN2I0Y2QiLCJpYXQiOjE1NTYyMDcwMjUsInJvbGUiOlsidXNlcl9' +
    'hcGlfcmVhZCIsInVzZXJfYXBpX3dyaXRlIl0sImdlbmVyYWwtcHVycG9zZSI6dHJ1ZSw' +
    'ic2FtbCI6e319.-7tuD6sdMhjEADykZ0QoMWAUfoXcHXlkpS3KRmLtN465A6wuK2fVtu' +
    '4y3OO2kqRcPZRkUMUGzAEi_LmCy5uQQQ';

window.loadComponent = ( function() {
	function fetch_and_parse(url) {
        return fetch(url).then((response) => {
            return response.text()
        }).then((html) => {
            const parser = new DOMParser();

            const document = parser.parseFromString( html, 'text/html' );
            const head = document.head;
            const template = head.querySelector( 'template' );
            const style = head.querySelector( 'style' );
            const script = head.querySelector( 'script' );

            return {
                template,
                style,
                script
            };
        });
	}

	function prepare_component({template, style, script}) {
        const script_file = new Blob(
            [script.textContent],
            {type: 'application/javascript'}
        );

        const module_url = URL.createObjectURL(script_file);

        function getListeners(settings) { // 1
            const listeners = {};

            Object.entries( settings ).forEach( ( [ setting, value ] ) => { // 3
                if (setting.startsWith( 'on' )) { // 4
                    listeners[ setting[ 2 ].toLowerCase() + setting.substr( 3 ) ] = value; // 5
                }
            });

            return listeners;
        }

	    return import(module_url).then((module) => {
            console.log(module);
            const listeners = getListeners(module.default);

            return {
                name: module.default.name,
                listeners,
                template, style, script
            }
        });
    }

    function register_component({name, listeners, template, style, script}) {
        class IolantaComponent extends HTMLElement {
            connectedCallback() {
                this._upcast();
                this._attachListeners()

                this.update()
            }

            get_query_id() {
                return this.attributes.query_id.value
            }

            display(data) {
                let container = this.shadow.getElementById('menu');

                data.map((datum) => {
                    let element = document.createElement('a');
                    element.setAttribute('href', '#' + datum.category)
                    element.setAttribute('class', 'item');

                    element.appendChild(document.createTextNode(datum.category.capitalize()));

                    container.appendChild(element)
                });
            }

            update() {
                let query_id = this.get_query_id();

                new Iolanta(TOKEN).execute_stored_query(query_id).then(this.display.bind(this))
            }

            _upcast() {
                const shadow = this.attachShadow({mode: 'open'});

                shadow.appendChild(style.cloneNode(true));
                shadow.appendChild(document.importNode(template.content, true ));

                this.shadow = shadow;
            }

            _attachListeners() {
                Object.entries(listeners).forEach( ([event, listener]) => {
                    this.addEventListener(event, listener, false);
                });
            }
        }

        return customElements.define(name, IolantaComponent);
    }

    function loadComponent(url) {
	    return fetch_and_parse(url).then(prepare_component).then(register_component);
    }

	return loadComponent;
}());
