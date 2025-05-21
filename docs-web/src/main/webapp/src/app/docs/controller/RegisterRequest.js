'use strict';

angular.module('docs').controller('RegisterRequest', function($scope, $state) {
  console.log("RegisterRequest controller loaded");

  $scope.register = {};
  $scope.successMessage = '';
  $scope.errorMessage = '';

  $scope.submitRegisterRequest = function() {
    // 模拟成功提示
    $scope.successMessage = "注册请求已提交，请等待审核。";
    console.log('注册提交：', $scope.register);
  };

  $scope.goBackToLogin = function() {
    $state.go('login');
  };
});
