// Code goes here
(function() {

  var app = angular.module("Domination");
  
  app.controller("MainController", ['$scope', '$interval', '$location', '$rootScope', MainController]);

  function MainController($scope, $interval, $location, $rootScope) {

    $scope.buildBoard = function () {
      $scope.done = false;
      $scope.dimension = 50;
      $scope.range = 4;
      $scope.board = [];
      $scope.score = 0;

      for (var i = 0; i < $scope.dimension; i++) {
        $scope.board.push([]);
        for (var j = 0; j < $scope.dimension; j++) {
          var square = { value: Math.floor(Math.random() * $scope.range) + 1 };
          $scope.board[i].push(square);
        }
      }
      //$scope.$apply();
    }

    var printBoard = function () {
      for (var i = 0; i < $scope.dimension; i++) {
        var row = "";
        for (var j = 0; j < $scope.dimension; j++) {
          row += $scope.board[j][i].value + ", ";
        }
        console.log(row);
      }
    }

    var addNeighbors = function (cell, origin, stack) {
      var cellx = cell.x;
      var celly = cell.y;
      if (cellx + 1 < $scope.dimension && $scope.board[cellx+1][celly].value == origin) {
        stack.push({ x: cellx+1, y: celly});
      }
      if (cellx - 1 >= 0 && $scope.board[cellx-1][celly].value == origin) {
        stack.push({ x: cellx-1, y: celly});
      }
      if (celly - 1 >= 0 && $scope.board[cellx][celly-1].value == origin) {
        stack.push({ x: cellx, y: celly-1});
      }
      if (celly + 1 < $scope.dimension && $scope.board[cellx][celly+1].value == origin) {
        stack.push({ x: cellx, y: celly+1});
      }
      return stack;
    }

    var move = function (choice, origin) {
      var stack = [];
      var currentCell = { x: 0, y: 0 };
      stack.push(currentCell);
      while (stack.length > 0) {
        currentCell = stack[0];
        if ($scope.board[currentCell.x][currentCell.y].value == choice) {
          stack = stack.splice(1, stack.length - 1);
          continue;
        }
        $scope.board[currentCell.x][currentCell.y].value = choice;
        stack = stack.splice(1, stack.length - 1);
        stack = addNeighbors(currentCell, origin, stack);
      }
    }


    var checkState = function () {
      var origin = $scope.board[0][0].value;
      for (var i = 0; i < $scope.dimension; i++) {
        for (var j = 0; j < $scope.dimension; j++) {
          if ($scope.board[i][j].value != origin) {
            return false;
          }
        }
      }
      return true;
    }

    $scope.begin = function (choice) {
      var origin = $scope.board[0][0].value;
      $scope.score += 1;
      move(choice, origin);
      if (checkState()) {
        console.log("YOU WIN!");
      }
    }

    $scope.auto = function () {
      var intervalId = setInterval(function() {
        var choice = Math.floor(Math.random() * $scope.range) + 1;
        var origin = $scope.board[0][0].value;
        $scope.score += 1;
        move(choice, origin);
        $scope.$apply();
        if (checkState()) {
          console.log("YOU WIN!");
          $scope.done = true;
          $scope.$apply();
          clearInterval(intervalId);
        }
      }, 50);
    }

    $scope.buildBoard();

  };

}());