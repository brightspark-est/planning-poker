describe("Router", function() {
  var router;

  beforeEach(function() {
    router = new Router("/");
  });




  it("should match plain url", function() {
      
    router.map(
        "home",
        "index.html",
        {
            controller: 'home',
            action: 'index'
        });
      
    var data = router.getRouteInfo("index.html");
      
    expect(data.route).not.toBe(undefined);
    expect(data.route.name).toBe("home");
    expect(data.routeParams.controller).toBe("home");
    expect(data.routeParams.action).toBe("index");
      
  });
  
  it("should match url pattern", function() {
      
    router.map(
        "default",
        ":controller/:action/:id",
        {
            controller: 'home',
            action: 'index'
        });
      
    var data = router.getRouteInfo("/products");
    
    expect(data.route).not.toBe(undefined);
    expect(data.route.name).toBe("default");
    expect(data.routeParams.controller).toBe("products");
    expect(data.routeParams.action).toBe("index");
    expect(data.routeParams.id).toBe(undefined);
      
  });
});
