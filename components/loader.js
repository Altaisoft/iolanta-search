window.loadComponent = ( function() {
	function fetch_and_parse(url) {
        return fetch(url).then((response) => {
            return response.text()
        }).then((html) => {
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

    function register_component() {
        class IolantaComponent extends HTMLElement {
            connectedCallback() {
                this._upcast();
            }

            _upcast() {
                const shadow = this.attachShadow( { mode: 'open' } );

                shadow.appendChild( style.cloneNode( true ) );
                shadow.appendChild( document.importNode( template.content, true ) );
            }
        }

        return customElements.define( 'dw-menu', IolantaComponent);
    }

    function loadComponent(url) {
	    return fetch_and_parse(url).then(register_component);
    }

	return loadComponent;
}());
