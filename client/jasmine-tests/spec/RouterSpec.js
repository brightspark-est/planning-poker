describe("Router", function() {
  var router;

  beforeEach(function() {
    router = new Router({
            filters: [
                // TBD
            ],
            routes: [
                {
                    name: "map",
                    pattern: "/:lang/Map/:action?/:id?",
                    defaults: { controller: "Map", action: "index" },
                    constraints: {
                        lang: function (val) {
                            return (val || "").length == 2;
                        }
                    }
                },
                {
                    name: "default-with-language",
                    pattern: "/:lang/:controller?/:action?/:id?",
                    defaults: { controller: "Home", action: "index" },
                    constraints: {
                        lang: function (val) {
                            return (val || "").length == 2;
                        }
                    }
                },
                {
                    name: "default",
                    pattern: "/:controller?/:action?/:id?",
                    defaults: { lang: "en", controller: "Home", action: "index" }
                }
            ]
        });
  });

  
  it("should match map url pattern", function() {
      
    var res = router.matchRoute("/et/Map".toLowerCase());

    expect(res.routeName).toBe("map");
            
  });

  
  it("should match url pattern", function() {
      
    var res = router.matchRoute("/et/home");

    expect(res.routeName).toBe("default-with-language");
            
  });

  
  it("should apply constraints when matching route", function() {
      
    var res = router.matchRoute("/home");
    expect(res.routeName).toBe("default");
            
  });
});
