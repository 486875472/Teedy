'use strict';

/**
 * User/group controller.
 */
angular.module('docs').controller('UserGroup', function(Restangular, $scope, $state, $http) {
  
  // Load users
  Restangular.one('user/list').get({
    sort_column: 1,
    asc: true
  }).then(function(data) {
    $scope.users = data.users;
  });

  // Load groups
  Restangular.one('group').get({
    sort_column: 1,
    asc: true
  }).then(function(data) {
    $scope.groups = data.groups;
  });

  // Open a user profile
  $scope.openUser = function(user) {
    $state.go('user.profile', { username: user.username });
  };

  // Open a group profile
  $scope.openGroup = function(group) {
    $state.go('group.profile', { name: group.name });
  };

  $scope.updateApprovalStatus = function(user) {
  // Use Restangular to send a PUT request with username as query parameter
  Restangular.one('user/approve').customPUT(null, '', { username: user.username }, {
    'Content-Type': 'application/json'  // Ensure Content-Type is set to application/json
  }).then(function(response) {
    // On success, show success message
    alert("用户注册已审批！");
    console.log("用户审批状态更新成功：", response.data);
  }, function(error) {
    // On failure, show an error message
    alert("审批失败，请重试！");
    console.error("审批失败", error);
  });
};
});