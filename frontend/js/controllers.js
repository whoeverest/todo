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
        .otherwise({
            redirectTo: '/todos'
        })
    }
])

app.factory('Todos', ['$http', function($http) {
    var service = {};

    service.all = function(callback) {
        return $http.get('/api/todos').success(function(response) {
            callback(response.results);
        });
    }

    service.new = function(options, callback) {
        $http.post('/api/todos', options).success(function(response) {
            callback(response.new_todo);
        })
    }

    service.delete = function(id, callback) {
        $http.delete('/api/todos/' + id).success(function(status) {
            callback(status);
        })
    }

    service.update = function(id, options) {
        $http.put('/api/todos/' + id, options).success(function(status) {
            console.log(status);
        })
    }

    service.one = function(id, callback) {
        $http.get('/api/todos/' + id).success(function(todo) {
            callback(todo);
        })
    }

    return service;
}])

app.controller('TodoCtrl', function($scope, Todos) {

    $scope.new = function() {
        Todos.new({ text: $scope.text }, function(new_todo) {
            $scope.todos.push(new_todo);
        })
    }

    $scope.delete = function(id) {
        Todos.delete(id, function(status) {
            // for (var i=0; i < $scope.todos.length; i++) {
            //     if ($scope.todos[i].id = id) {
            //         $scope.todos.pop(i);
            //         break;
            //     }
            // };
        });
    }

    $scope.update = function(id) {
        Todos.update(id, { text: $scope.edit_text });
    }
    
    Todos.all(function(results) {
        $scope.todos = results;
    })

})

app.controller('EditTodoCtrl', function($scope, Todos, $routeParams) {

    $scope.priorities = ['high', 'normal', 'low'];

    Todos.one($routeParams.id, function(todo) {
        // I need an 'extend(o1, o2)' function here.
        $scope.text = todo.todo.text;
        $scope.priority = todo.todo.priority;
    })

    $scope.update = function() {
        var options = {
            text: $scope.text,
            priority: $scope.priority,
        }

        Todos.one($routeParams.id, function(todo) {
            Todos.update($routeParams.id, options);
        })
    }

})
