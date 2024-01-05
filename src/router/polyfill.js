// 重写路由的push方法，解决同一路由多次跳转报错 message: "Navigating to current location (XXX) is not allowed"
export default (VueRouter) => {
  const { push: routerPush, replace: routerReplace } = VueRouter.prototype;
  VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject);
    return routerPush.call(this, location).catch((err) => err);
  };
  VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
    if (onResolve || onReject) return routerReplace.call(this, location, onResolve, onReject);
    return routerReplace.call(this, location).catch((err) => err);
  };
};
