import { Iolanta } from "./iolanta";

Vue.component('datadotworld-table', {
    props: ['query_id'],
    template: `
<table class="ui left aligned table">
    <thead>
    <th>Name</th>
    <th>URL</th>
    <th>Description</th>
    <th>Updated Time</th>
    <th>Online?</th>
    </thead>
    <tbody>
        <tr v-for="row in dataset">
            <td>{{ row.name }}</td>
            <td>{{ row.url }}</td>
            <td>{{ row.description }}</td>
            <td>{{ row.last_updated }}</td>
            <td v-if="row.is_online">
                <i class="check icon"></i>
            </td>
            <td v-else-if="row.is_online == false">
                <i class="times icon"></i>
            </td>
            <td v-else>

            </td>
        </tr>
    </tbody>
</table>`,
    data: function() {
        return {
            dataset: null
        }
    },
    methods: {
        update: function() {
            // noinspection SpellCheckingInspection
            let app = this,
                token =
                    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OnlldGktcmVhZG9' +
                    'ubHkiLCJpc3MiOiJhZ2VudDp5ZXRpLXJlYWRvbmx5Ojo1Y2Q4YmE5Zi01ZGQ2LTQ4MWU' +
                    'tOWUxOC04NTIwYjIxN2I0Y2QiLCJpYXQiOjE1NTYyMDcwMjUsInJvbGUiOlsidXNlcl9' +
                    'hcGlfcmVhZCIsInVzZXJfYXBpX3dyaXRlIl0sImdlbmVyYWwtcHVycG9zZSI6dHJ1ZSw' +
                    'ic2FtbCI6e319.-7tuD6sdMhjEADykZ0QoMWAUfoXcHXlkpS3KRmLtN465A6wuK2fVtu' +
                    '4y3OO2kqRcPZRkUMUGzAEi_LmCy5uQQQ';

            new Iolanta(token).execute_stored_query(
                app.query_id
            ).then(function (data) {
                app.dataset = data;
            });

            new Iolanta(token).execute_stored_query(
                'eafde27a-f163-41bb-a9cf-7a8a3f46a01c'
            ).then(function (data) {
                app.category_list = data.map(function(datum) { return datum.category });
            });

            /*
            FIXME I will continue experimentation with this a bit later

            new Iolanta(token).execute_stored_query(
                '10b74064-7b75-4a79-9022-7b8bdca67f5b',
                'construct'
            ).then(function (data) {
                console.log(data);
            })
            */
        }
    },
    created: function() {
        this.update();
    }
});

let app = new Vue({
    el: '#app',
});
