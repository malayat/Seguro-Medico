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
}

function RemoteResourceProvider() {
    var _baseUrl;
    
    this.setBaseUrl = function(baseUrl) {
        _baseUrl = baseUrl;
    };
    
    this.$get = ['$http', function ($http) {
            return new RecuperarInformacionExterna($http, _baseUrl);
        }];
}

app.provider("remoteResource", RemoteResourceProvider);

app.constant("baseUrl", ".");
app.config(['baseUrl', 'remoteResourceProvider', function (baseUrl, remoteResourceProvider){
        remoteResourceProvider.setBaseUrl(baseUrl);
}]);


app.controller("SeguroController", ['$scope', 'remoteResource', function ($scope, remoteResource) {
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
        }, function (data, status) {
            alert("Ha fallado la petición. Estado HTTP:" + status);
        });
        
        $scope.urlLogo = "http://www.cursoangularjs.es/lib/exe/fetch.php?cache=&media=unidades:04_masdirectivas:medical14.png";

    }
]);