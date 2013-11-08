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
        .otherwise({
            redirectTo: '/todos'
        })
    }
])

app.factory('Todos', ['$http', function($http) {
    var TodosModel = {};

    TodosModel.all = function(callback) {
        return $http.get('/api/todos').success(function(response) {
            callback(response.results);
        });
    }

    TodosModel.new = function(options, callback) {
        $http.post('/api/todos', options).success(function(response) {
            callback(response.new_todo);
        })
    }

    TodosModel.delete = function(id, callback) {
        $http.delete('/api/todos/' + id).success(function(status) {
            callback(status);
        })
    }

    TodosModel.update = function(id, options, callback) {
        $http.put('/api/todos/' + id, options).success(function(status) {
            callback(status);
        })
    }

    TodosModel.one = function(id, callback) {
        $http.get('/api/todos/' + id).success(function(todo) {
            callback(todo);
        })
    }

    return TodosModel;
}])

app.factory('Users', ['$http', function($http) {
    var UsersModel = {};

    UsersModel.create = function(email, password) {
        $http.post('/api/signup', { email: email, password: password })
        .success(function(status) {
            console.log(status);
        })
    }

    UsersModel.login = function(email, password) {
        $http.post('/api/login', { email: email, password: password })
        .success(function(status) {
            console.log(status);
        })
    }

    return UsersModel;
}])

app.controller('TodoCtrl', function($scope, Todos) {

    $scope.new = function() {
        Todos.new({ text: $scope.text }, function(new_todo) {
            $scope.todos.push(new_todo);
            $scope.text = '';
        })
    }

    $scope.delete = function(i) {
        var todo = $scope.todos[i];
        Todos.delete(todo._id, function(status) {
            $scope.todos.splice(i, 1);
        });
    }

    $scope.update = function(id) {
        Todos.update(id, { text: $scope.edit_text });
    }
    
    Todos.all(function(results) {
        $scope.todos = results;
    })

})

app.controller('EditTodoCtrl', function($scope, Todos, $routeParams, $location) {

    $scope.priorities = [1,2,3];

    Todos.one($routeParams.id, function(todo) {
        // I need an 'extend(o1, o2)' function here.
        $scope.text = todo.todo.text;
        $scope.priority = todo.todo.priority;
        $scope.due_date = todo.todo.due_date;
    })

    $scope.update = function() {
        var options = {
            text: $scope.text,
            priority: $scope.priority,
            due_date: Date.parse($scope.due_date),
        }

        Todos.one($routeParams.id, function(todo) {
            Todos.update($routeParams.id, options, function(status) {
                $location.path('/todos');
            });
        })
    }

})

app.controller('SignupCtrl', function($scope, Users) {

    $scope.signup = function() {
        Users.create($scope.email, $scope.password);
    }

})

app.controller('LoginCtrl', function($scope, Users) {

    $scope.login = function() {
        Users.login($scope.email, $scope.password);
    }
    
})