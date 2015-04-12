(function() {
	'use strict';
	var app = angular.module('app', []);

	app.factory('phraseService', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
		var service = {},
			strict = false,
			ajaxCall = function(phrase, strict) {
				var d = $q.defer();
				$http.get('/api/phrase/' + phrase + '/' + strict).success(function(data, status, headers, config, statusText) {
					d.resolve(data);
				});

				return d.promise;
			};
		service.setStrict = function(s) {
			strict = s;
		};

		service.query = function(phrase) {
			var d = $q.defer();
			ajaxCall(phrase, strict).then(function(data) {
				d.resolve(data);
			});

			return d.promise;
		};

		service.newQuery = function(phrase) {
			ajaxCall(phrase, strict).then(function(data) {
				$rootScope.$emit('newQuery', data);
			});
		};
		return service;
	}]);
	//phraseService end

	app.controller('headerCtrl', ['$scope', 'phraseService', function($scope, phraseService) {
		$scope.strict = false;
		$scope.phrase = '一成不變';
		$scope.switchStrict = function() {
			$scope.strict = !($scope.strict);
			phraseService.setStrict($scope.strict);
		};

		$scope.newQuery = function() {
			phraseService.newQuery($scope.phrase, $scope.strict);
		};
	}]);
	//headerCtrl end

	app.controller('containerCtrl', ['$rootScope', '$scope', 'phraseService', function($rootScope, $scope, phraseService) {
		$scope.chain = [];
		var pushError = function() {
			$scope.chain.push(['我不認識這個成語啊ＱＱ']);
		};
		var pushCandidates = function(candidates) {
			$scope.chain.push(candidates);
		};
		var cb = function(data) {
			if (data.status !== 'success') {
				pushError();
				return;
			}
			pushCandidates(data.next);
		};
		$rootScope.$on('newQuery', function(event, data) {
			$scope.chain = []; //reset
			cb(data);
		});

		$scope.query = function(n) {
			phraseService.query(n).then(function(data) {
				console.log('query cb');
			});
		};

		$scope.removeDown = function(index) {
			$scope.chain = $scope.chain.slice(0, index + 1);
		};

	}]);
	//containerCtrl end
})();