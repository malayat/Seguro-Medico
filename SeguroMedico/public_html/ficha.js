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
app.config(['baseUrl', 'remoteResourceProvider', function (baseUrl, remoteResourceProvider) {
        remoteResourceProvider.setBaseUrl(baseUrl);
    }]);

app.value("urlLogo", "http://www.cursoangularjs.es/lib/exe/fetch.php?cache=&media=unidades:04_masdirectivas:medical14.png");
app.run(['$rootScope', 'urlLogo', function ($rootScope, urlLogo) {
        $rootScope.urlLogo = urlLogo;
    }]);

app.controller("DetalleSeguroController", ['$scope', 'remoteResource', function ($scope, remoteResource) {

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

//        $scope.urlLogo = "http://www.cursoangularjs.es/lib/exe/fetch.php?cache=&media=unidades:04_masdirectivas:medical14.png";
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