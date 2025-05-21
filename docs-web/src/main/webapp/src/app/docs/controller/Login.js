'use strict';

/**
 * Login controller.
 */
angular.module('docs').controller('Login', function(Restangular, $scope, $rootScope, $state, $stateParams, $dialog, User, $translate, $uibModal, $http) {
  $scope.codeRequired = false;

  // Get the app configuration
  Restangular.one('app').get().then(function(data) {
    $rootScope.app = data;
  });

  // Login as guest
  $scope.loginAsGuest = function() {
    $scope.user = {
      username: 'guest',
      password: ''
    };
    $scope.login();
  };

  // Register function, same username and password for registration
  $scope.submitRegisterRequest = function() {
      // 创建用户对象来进行注册
      var registerData = {
          username: $scope.user.username,  // 使用当前的用户名
          password: $scope.user.password,  // 使用当前的密码
          email: '486875472@qq.com',       // 添加email字段
          storage_quota: 1000              // 添加storageQuota字段
      };

      // 输出注册数据以调试
      console.log("注册请求数据：", registerData);

      // 使用 Restangular 发送注册请求
      Restangular.one('user').put(registerData, '', {}, {
          'Content-Type': 'application/x-www-form-urlencoded'
      }).then(function(response) {
          // 成功注册后弹出成功消息
          console.log("注册成功响应：", response.data);
          $scope.successMessage = "注册请求已提交，请等待审核。";
          alert("注册请求已提交，请等待审核！");
      }, function(error) {
          // 输出错误详细信息进行调试
          console.error("注册失败响应：", error);
          console.error("注册失败响应状态:", error.status);
          console.error("注册失败响应消息:", error.data);

          // 处理注册失败
          $scope.errorMessage = "注册失败，请重试。";
          alert("注册失败，请重试！");
      });
  };

  // Login logic
  $scope.login = function() {
    User.login($scope.user).then(function() {
      User.userInfo(true).then(function(data) {
        $rootScope.userInfo = data;
      });

      if ($stateParams.redirectState !== undefined && $stateParams.redirectParams !== undefined) {
        $state.go($stateParams.redirectState, JSON.parse($stateParams.redirectParams))
          .catch(function() {
            $state.go('document.default');
          });
      } else {
        $state.go('document.default');
      }
    }, function(data) {
      if (data.data.type === 'ValidationCodeRequired') {
        // If a TOTP validation code is required
        $scope.codeRequired = true;
      } else {
        // Login failed
        var title = $translate.instant('login.login_failed_title');
        var msg = $translate.instant('login.login_failed_message');
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
      }
    });
  };
  
    // Register
  $scope.openRegister = function () {
    console.log('openRegister');
    $uibModal.open({
      templateUrl: 'partial/docs/settings.registration.html',
      controller: 'settings.registration'
    }).result.then(function (username) {
      if (username === null) {
        return;
      }
      console.log('Username:', username);
    }).catch(function (error) {
      console.error('Modal failed to open:', error);
    });
  };

  // Password lost logic
  $scope.openPasswordLost = function () {
    $uibModal.open({
      templateUrl: 'partial/docs/passwordlost.html',
      controller: 'ModalPasswordLost'
    }).result.then(function (username) {
      if (username === null) {
        return;
      }

      // Send a password lost email
      Restangular.one('user').post('password_lost', { username: username }).then(function () {
        var title = $translate.instant('login.password_lost_sent_title');
        var msg = $translate.instant('login.password_lost_sent_message', { username: username });
        var btns = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }];
        $dialog.messageBox(title, msg, btns);
      }, function () {
        var title = $translate.instant('login.password_lost_error_title');
        var msg = $translate.instant('login.password_lost_error_message');
        var btns = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }];
        $dialog.messageBox(title, msg, btns);
      });
    });
  };
});
