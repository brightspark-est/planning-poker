describe("RenderEgine", function() {


    var DummyComponent = function DummyComponent() {
                
        this.render = function () {
            return "OK!";
        }
        
    };
    
    var DummyComponentView = function DummyComponentView (dummyComponent, domContext) {
        
        this.render = function () {
            
            var div = document.createElement("div");

            var html = "OK!";
            div.innerHTML = html;

            return div.childNodes;            
        };
    }

    Re.componentFactory = new (function () {
        
        this.create = function () {
            // dummy component
            return new DummyComponent();
        };
        
        this.createView = function () {
            
            return new DummyComponentView();
        }
        
    });

    it("should do it", function () {
        
        var x = Re.render2("<div><component:x /></div>");
    })

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