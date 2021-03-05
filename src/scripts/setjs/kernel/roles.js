import {roleFlags} from 'config/user-roles.js';

var accessFlag = roleFlags.unknown;

function setAccessFlag(flag) {
  if (flag) {
    accessFlag = flag;
  }
  return flag;
}

function testRole(role) {
  if (role) {
    return (role & accessFlag) > 0;
  }
  return true;
}

function roleFlag(roleList) {
  var flag = 0;
  roleList.forEach(function(roleName) {
    if (roleFlags[roleName]) {
      flag |= roleFlags[roleName];
    }
  });
  return flag;
}

function cascadeRoleFlag(roleName) {
  return -(roleFlags[roleName] || 0);
}

export {setAccessFlag, testRole, roleFlag, cascadeRoleFlag};
