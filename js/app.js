(function() {
	'use strict';
	var app = angular.module('app', []);

	app.factory('phraseService', ['$http', '$q', function($http, $q) {
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
				data.strict = strict;
				d.resolve(data);
			});

			return d.promise;
		};
		return service;
	}]);
	//phraseService end

	app.directive('candidateLabel', [function() {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				element.bind('click', function(eventData) {
					element.siblings().removeClass('active');
					element.addClass('active');
				});
			}
		};
	}]);
	//candidateLabel end

	app.directive('downArrow', [function() {
		return {
			restrict: 'A',
			scope: false,
			template: '<div class="row"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></div>',
			replace: true
		};
	}]);
	app.controller('headerCtrl', ['$rootScope', '$scope', 'phraseService', function($rootScope, $scope, phraseService) {
		$scope.strict = false;
		$scope.phrase = '一成不變';
		$scope.switchStrict = function() {
			$scope.strict = !($scope.strict);
			phraseService.setStrict($scope.strict);
		};

		$scope.newQuery = function() {
			phraseService.query($scope.phrase, $scope.strict).then(function(data) {
				$rootScope.$emit('newQuery', data);
			});
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
			pushCandidates({
				data: data.next,
				strict: data.strict
			});
		};

		$rootScope.$on('newQuery', function(event, data) {
			$scope.chain = []; //reset
			cb(data);
		});

		$scope.query = function(n) {
			phraseService.query(n).then(function(data) {
				cb(data);
			});
		};

		$scope.removeDown = function(index) {
			$scope.chain = $scope.chain.slice(0, index + 1);
		};

	}]);
	//containerCtrl end
})();