var app = angular.module('TodoApp', ['ngRoute']);

app.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider
        .when('/todos', {
            templateUrl: 'partials/todos.html',
            controller: 'TodoCtrl'
        })
        .when('/todos/edit/:id', {
            templateUrl: 'partials/edit.html',
            controller: 'EditTodoCtrl'
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            templateUrl: function(){}, // angular shitiness.
            controller: 'LogoutCtrl'
        })
        .when('/new_api_key', {
            templateUrl: 'partials/new_api_key.html',
            controller: 'NewApiKeyCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        })
    }
])

app.factory('Todos', ['$http', '$q', function($http, $q) {
    var TodosModel = {};

    TodosModel.all = function() {
        var deferred = $q.defer();
        $http.get('/api/todos').success(function(response) {
            deferred.resolve(response.todos);
        }).error(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    TodosModel.new = function(options) {
        var deferred = $q.defer();
        $http.post('/api/todos', options).success(function(response) {
            deferred.resolve(response.todo);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    TodosModel.delete = function(id) {
        var deferred = $q.defer();
        $http.delete('/api/todos/' + id).success(function() {
            deferred.resolve();
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    TodosModel.update = function(id, options) {
        if (options._id) {
            // Mongo doesn't allow us to modify the id.
            new_options = angular.copy(options);
            delete new_options._id;
        }

        var deferred = $q.defer();
        $http.put('/api/todos/' + id, new_options).success(function(response) {
            deferred.resolve(response.todo);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    TodosModel.one = function(id) {
        var deferred = $q.defer();
        $http.get('/api/todos/' + id).success(function(response) {
            deferred.resolve(response.todo);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    return TodosModel;
}])

app.factory('Users', ['$http', '$q',function($http, $q) {
    var UsersModel = {};

    UsersModel.create = function(email, password) {
        var deferred = $q.defer();
        $http.post('/api/users', { email: email, password: password })
        .success(function(response) {
            deferred.resolve(response);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    UsersModel.login = function(email, password) {
        var deferred = $q.defer();
        $http.post('/api/login', { email: email, password: password })
        .success(function(response) {
            deferred.resolve(response);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    UsersModel.logout = function() {
        var deferred = $q.defer();
        $http.post('/api/logout').success(function(response) {
            deferred.resolve(response);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    UsersModel.new_api_key = function() {
        var deferred = $q.defer();
        $http.post('/api/new_api_key').success(function(response) {
            deferred.resolve(response);
        }).error(function(err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    return UsersModel;
}])

app.controller('TodoCtrl', function($scope, Todos) {

    $scope.predicate = 'priority';
    $scope.reverse = true;

    $scope.new = function() {
        Todos.new({ text: $scope.text }).then(function(todo) {
            $scope.todos.push(todo);
            $scope.text = '';
        }, function(err) {
            $scope.error = err;
        })
    }

    $scope.delete = function(todo) {
        Todos.delete(todo._id).then(function(status) {
            $scope.todos = $scope.todos.filter(function(el) {
                return el._id !== todo._id;
            })
        }, function(err) {
            $scope.error = err;
        });
    }

    $scope.update = function(todo) {
        Todos.update(todo._id, todo).then(function(todo) {
            // pass
        }, function(err) {
            $scope.error = err;
        });
    }
    
    Todos.all().then(function(data) {
        $scope.todos = data;
    }, function(err) {
        $scope.error = err;
    })

})

app.controller('EditTodoCtrl', function($scope, $routeParams, $location, Todos) {

    $scope.priorities = [1,2,3];
    $scope.todo = {};

    Todos.one($routeParams.id).then(function(todo) {
        angular.extend($scope.todo, todo);
    }, function(err) {
        $scope.error = err;
    })

    $scope.update = function() {
        Todos.update($routeParams.id, $scope.todo).then(function(status) {
            $location.path('/todos');
        }, function(err) {
            $scope.error = err;
        });
    }
})

app.controller('SignupCtrl', function($scope, $location, Users) {
    $scope.signup = function() {
        Users.create($scope.email, $scope.password).then(function(response) {
            $location.path('/login');
        }, function(err) {
            $scope.error = err;
        });
    }
})

app.controller('LoginCtrl', function($scope, $location, Users) {
    $scope.login = function() {
        Users.login($scope.email, $scope.password).then(function(response) {
            $location.path('/todos');
        }, function(err) {
            $scope.error = err;
        });
    } 
})

app.controller('LogoutCtrl', function($location, Users) {
    console.log('here');
    Users.logout(function(status) {
        console.log(status);
        $location.path('/login');
    })
})

app.controller('NewApiKeyCtrl', function($scope, Users) {
    $scope.generate_new_api_key = function() {
        Users.new_api_key()
    }
})

app.filter('priorityName', function() {
    return function(priority) {
        var names = { 1: 'low', 2: 'normal', 3: 'high' };
        return names[priority];
    }
})
