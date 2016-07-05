describe("RenderEgine", function() {


    var DummyComponent = function DummyComponent() {
                
        this.render = function () {
            return "OK!";
        }
        
    };

    Re.componentFactory = new (function () {
        
        this.create = function () {
            // dummy component
            return new DummyComponent();
        };
        
    });

    it("should replace component container with its html", function() {
 
        var html = Re.render("<div><component:TestComponent /></div>");
        
        expect(html.html).toBe("<div>OK!</div>");
        expect(html.model.testComponent instanceof DummyComponent).toBe(true);
    });
    
    it("should be able to register multiple unnamed components in model", function () {

        var html = Re.render("<div><component:TestComponent /><component:TestComponent /></div>");
        
        expect(html.html).toBe("<div>OK!OK!</div>");
        expect(html.model.testComponent instanceof DummyComponent).toBe(true);
        expect(html.model.testComponent2 instanceof DummyComponent).toBe(true);
    });
    
    it("should be able to match parameters from component container", function() {
 
        var html = Re.render("<div><component:TestComponent name='x' foo=\"bar\" /></div>");
        
        expect(html == "<div>OK!</div>").toBe(true);
        expect(html === "<div>OK!</div>").toBe(false);
        expect(html.html).toBe("<div>OK!</div>");
        expect(html.toString()).toBe("<div>OK!</div>");

        expect(html.model.x instanceof DummyComponent).toBe(true);
    });
});