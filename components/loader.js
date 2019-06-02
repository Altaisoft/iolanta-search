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

        function getListeners( settings ) { // 1
            const listeners = {};

            Object.entries( settings ).forEach( ( [ setting, value ] ) => { // 3
                if ( setting.startsWith( 'on' ) ) { // 4
                    listeners[ setting[ 2 ].toLowerCase() + setting.substr( 3 ) ] = value; // 5
                }
            } );

            return listeners;
        }

	    return import(module_url).then((module) => {
            console.log(module);
            const listeners = getListeners( module.default );

            return {
                name: module.default.name,
                listeners,
                template, style, script
            }
        })
    }

    function register_component({name, listeners, template, style, script}) {
        class IolantaComponent extends HTMLElement {
            connectedCallback() {
                this._upcast();
                this._attachListeners()
            }

            _upcast() {
                const shadow = this.attachShadow( { mode: 'open' } );

                shadow.appendChild( style.cloneNode( true ) );
                shadow.appendChild( document.importNode( template.content, true ) );
            }

            _attachListeners() {
                Object.entries( listeners ).forEach( ( [ event, listener ] ) => { // 3
                    this.addEventListener( event, listener, false ); // 4
                } );
            }
        }

        return customElements.define( name, IolantaComponent);
    }

    function loadComponent(url) {
	    return fetch_and_parse(url).then(prepare_component).then(register_component);
    }

	return loadComponent;
}());
