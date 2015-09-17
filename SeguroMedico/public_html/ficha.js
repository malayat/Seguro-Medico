var app = angular.module("app", []);

function RecuperarInformacionExterna($http, baseUrl) {
    this.obtener = function (fnOK, fnError) {
        $http({
            method: 'GET',
            url: baseUrl + '/datos.json'
        }).success(function (data, status, headers, config) {
            fnOK(data);
        }).error(function (data, status, headers, config) {
            fnError(status);
        });
    };
    this.lista = function (fnOK, fnError) {
        $http({
            method: 'GET',
            url: baseUrl + '/listado_seguros.json'
        }).success(function (data, status, headers, config) {
            fnOK(data);
        }).error(function (data, status, headers, config) {
            fnError(status);
        });
    };
}

function RemoteResourceProvider() {
    var _baseUrl;

    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    };

    this.$get = ['$http', function ($http) {
            return new RecuperarInformacionExterna($http, _baseUrl);
        }];
}

app.provider("remoteResource", RemoteResourceProvider);

app.constant("baseUrl", ".");
//Recuerda que al inyectar el provider en un bloque config hay que incluir en el nombre el sufijo “Provider”.
//Por ejemplo si el servicio se llama “login” ,al inyectarlo en un bloque config habrá que poner “loginProvider” 
app.config(['baseUrl', 'remoteResourceProvider', function (baseUrl, remoteResourceProvider) {
        remoteResourceProvider.setBaseUrl(baseUrl);
    }]);

app.value("urlLogo", "http://www.cursoangularjs.es/lib/exe/fetch.php?cache=&media=unidades:04_masdirectivas:medical14.png");
app.run(['$rootScope', 'urlLogo', function ($rootScope, urlLogo) {
        $rootScope.urlLogo = urlLogo;
    }]);

app.filter("filteri18n", ["$filter", function ($filter) {
        
        var filterFn = $filter("filter");

        /** Transforma el texto quitando todos los acentos diéresis, etc. **/
        function normalize(texto) {
            texto = texto.replace(/[áàäâ]/g, "a");
            texto = texto.replace(/[éèëê]/g, "e");
            texto = texto.replace(/[íìïî]/g, "i");
            texto = texto.replace(/[óòôö]/g, "o");
            texto = texto.replace(/[úùüü]/g, "u");
            texto = texto.toUpperCase();
            return texto;
        }
        
        /** Esta función es el comparator en el filter **/
        function comparator (actual, expected) {
            if(normalize(actual).indexOf(normalize(expected)) >= 0) {
                return true;
            }
            return false;
        }
        
        function filteri18n(array, expression) {
            //Lo único que hace es llamar al filter original pero pasado
            //la nueva función de comparator
            return filterFn(array, expression, comparator);
        }
        
        return filteri18n;
    }]);

app.controller("DetalleSeguroController", ['$scope', 'remoteResource', function ($scope, remoteResource) {
        
        $scope.filtro = {
            ape1: ""
        };

        //array datos sexos
        $scope.sexos = [
            {
                codSexo: "H",
                descripcion: "Hombre"
            }, {
                codSexo: "M",
                descripcion: "Mujer"
            }
        ];

        $scope.seguro = {
            nif: "",
            nombre: "",
            ape1: "",
            edad: undefined,
            sexo: "",
            casado: false,
            numHijos: undefined,
            embarazada: false,
            coberturas: {
                oftalmologia: false,
                dental: false,
                fecundacionInVitro: false
            },
            enfermedades: {
                corazon: false,
                estomacal: false,
                rinyones: false,
                alergia: false,
                nombreAlergia: ""
            },
            fechaCreacion: new Date()
        };

        remoteResource.obtener(function (seguro) {
            $scope.seguro = seguro;
        }, function (status) {
            alert("Ha fallado la petición. Estado HTTP:" + status);
        });
    }
]);

app.controller("ListadoSeguroController", ['$scope', 'remoteResource', function ($scope, remoteResource) {
        $scope.seguros = [];

        remoteResource.lista(function (seguros) {
            $scope.seguros = seguros;
        }, function (status) {
            alert("Ha fallado la peticion. Estado HTTP: " + status);
        });

    }]);

app.controller("MainController", ['$scope', function ($scope) {

    }]);