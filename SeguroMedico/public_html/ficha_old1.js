var app = angular.module("app", []);

app.controller("SeguroController", ['$scope', '$log','$http', function ($scope,$log, $http) {
        
         $scope.seguro = {
        nif:"",
        nombre:"",
        ape1:"",
        edad:undefined,
        sexo:"",
        casado:false,
        numHijos:undefined,
        embarazada:false,
        
        coberturas: {
            oftamologia: false,
            dental: false,
            fecuandacionInVitro:false
        },
        
        enfermedades: {
            corazon: false,
            estomacal: false,
            riniones: false,
            alergia: false,
            nombreAlergia:""
        },
        
        fechaCreacion:new Date()
    };
    $log.debug("Acabamos de crear el $scope");
    
    //bad practice
    $http({
        method:"GET",
        url:"datos.json"
    }).success(function (data, status, header, config){
        $scope.seguro = data;
    }).error(function (data, status, header, config){
        alert("Error " +status);
    });
}
    
]);